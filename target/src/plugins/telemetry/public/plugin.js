"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryPlugin = void 0;
const services_1 = require("./services");
const telemetry_config_1 = require("../common/telemetry_config");
const get_telemetry_notify_user_about_optin_default_1 = require("../common/telemetry_config/get_telemetry_notify_user_about_optin_default");
const constants_1 = require("../common/constants");
class TelemetryPlugin {
    constructor(initializerContext) {
        this.canUserChangeSettings = true;
        this.currentKibanaVersion = initializerContext.env.packageInfo.version;
        this.config = initializerContext.config.get();
    }
    setup({ http, notifications }) {
        const config = this.config;
        this.telemetryService = new services_1.TelemetryService({ config, http, notifications });
        this.telemetrySender = new services_1.TelemetrySender(this.telemetryService);
        return {
            telemetryService: this.telemetryService,
        };
    }
    start({ http, overlays, application, savedObjects }) {
        if (!this.telemetryService) {
            throw Error('Telemetry plugin failed to initialize properly.');
        }
        this.canUserChangeSettings = this.getCanUserChangeSettings(application);
        this.telemetryService.userCanChangeSettings = this.canUserChangeSettings;
        this.telemetryNotifications = new services_1.TelemetryNotifications({
            overlays,
            telemetryService: this.telemetryService,
        });
        application.currentAppId$.subscribe(async () => {
            const isUnauthenticated = this.getIsUnauthenticated(http);
            if (isUnauthenticated) {
                return;
            }
            // Update the telemetry config based as a mix of the config files and saved objects
            const telemetrySavedObject = await this.getTelemetrySavedObject(savedObjects.client);
            const updatedConfig = await this.updateConfigsBasedOnSavedObjects(telemetrySavedObject);
            this.telemetryService.config = updatedConfig;
            const telemetryBanner = updatedConfig.banner;
            this.maybeStartTelemetryPoller();
            if (telemetryBanner) {
                this.maybeShowOptedInNotificationBanner();
                this.maybeShowOptInBanner();
            }
        });
        return {
            telemetryService: this.telemetryService,
            telemetryNotifications: this.telemetryNotifications,
            telemetryConstants: {
                getPrivacyStatementUrl: () => constants_1.PRIVACY_STATEMENT_URL,
            },
        };
    }
    /**
     * Can the user edit the saved objects?
     * This is a security feature, not included in the OSS build, so we need to fallback to `true`
     * in case it is `undefined`.
     * @param application CoreStart.application
     * @private
     */
    getCanUserChangeSettings(application) {
        return application.capabilities?.savedObjectsManagement?.edit ?? true;
    }
    getIsUnauthenticated(http) {
        const { anonymousPaths } = http;
        return anonymousPaths.isAnonymous(window.location.pathname);
    }
    maybeStartTelemetryPoller() {
        if (!this.telemetrySender) {
            return;
        }
        this.telemetrySender.startChecking();
    }
    maybeShowOptedInNotificationBanner() {
        if (!this.telemetryNotifications) {
            return;
        }
        const shouldShowBanner = this.telemetryNotifications.shouldShowOptedInNoticeBanner();
        if (shouldShowBanner) {
            this.telemetryNotifications.renderOptedInNoticeBanner();
        }
    }
    maybeShowOptInBanner() {
        if (!this.telemetryNotifications) {
            return;
        }
        const shouldShowBanner = this.telemetryNotifications.shouldShowOptInBanner();
        if (shouldShowBanner) {
            this.telemetryNotifications.renderOptInBanner();
        }
    }
    async updateConfigsBasedOnSavedObjects(telemetrySavedObject) {
        const configTelemetrySendUsageFrom = this.config.sendUsageFrom;
        const configTelemetryOptIn = this.config.optIn;
        const configTelemetryAllowChangingOptInStatus = this.config.allowChangingOptInStatus;
        const currentKibanaVersion = this.currentKibanaVersion;
        const allowChangingOptInStatus = telemetry_config_1.getTelemetryAllowChangingOptInStatus({
            configTelemetryAllowChangingOptInStatus,
            telemetrySavedObject,
        });
        const optIn = telemetry_config_1.getTelemetryOptIn({
            configTelemetryOptIn,
            allowChangingOptInStatus,
            telemetrySavedObject,
            currentKibanaVersion,
        });
        const sendUsageFrom = telemetry_config_1.getTelemetrySendUsageFrom({
            configTelemetrySendUsageFrom,
            telemetrySavedObject,
        });
        const telemetryNotifyUserAboutOptInDefault = get_telemetry_notify_user_about_optin_default_1.getNotifyUserAboutOptInDefault({
            telemetrySavedObject,
            allowChangingOptInStatus,
            configTelemetryOptIn,
            telemetryOptedIn: optIn,
        });
        return {
            ...this.config,
            optIn,
            sendUsageFrom,
            telemetryNotifyUserAboutOptInDefault,
            userCanChangeSettings: this.canUserChangeSettings,
        };
    }
    async getTelemetrySavedObject(savedObjectsClient) {
        try {
            // Use bulk get API here to avoid the queue. This could fail independent requests if we don't have rights to access the telemetry object otherwise
            const { savedObjects: [{ attributes }], } = (await savedObjectsClient.bulkGet([
                {
                    id: 'telemetry',
                    type: 'telemetry',
                },
            ]));
            return attributes;
        }
        catch (error) {
            const errorCode = error[Symbol('SavedObjectsClientErrorCode')];
            if (errorCode === 'SavedObjectsClient/notFound') {
                return null;
            }
            if (errorCode === 'SavedObjectsClient/forbidden') {
                return false;
            }
            throw error;
        }
    }
}
exports.TelemetryPlugin = TelemetryPlugin;
