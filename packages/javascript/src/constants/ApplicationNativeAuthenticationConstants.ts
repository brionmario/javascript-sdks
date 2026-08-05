// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Constants representing Application Native Authentication related configurations and constants.
 */
const ApplicationNativeAuthenticationConstants: {
  readonly SupportedAuthenticators: {
    readonly EmailOtp: string;
    readonly Facebook: string;
    readonly GitHub: string;
    readonly Google: string;
    readonly IdentifierFirst: string;
    readonly LinkedIn: string;
    readonly MagicLink: string;
    readonly Microsoft: string;
    readonly Passkey: string;
    readonly PushNotification: string;
    readonly SignInWithEthereum: string;
    readonly SmsOtp: string;
    readonly Totp: string;
    readonly UsernamePassword: string;
  };
} = {
  SupportedAuthenticators: {
    EmailOtp: 'ZW1haWwtb3RwLWF1dGhlbnRpY2F0b3I6TE9DQUw',
    Facebook: 'RmFjZWJvb2tBdXRoZW50aWNhdG9yOkZhY2Vib29r',
    GitHub: 'R2l0aHViQXV0aGVudGljYXRvcjpHaXRIdWI',
    Google: 'R29vZ2xlT0lEQ0F1dGhlbnRpY2F0b3I6R29vZ2xl',
    IdentifierFirst: 'SWRlbnRpZmllckV4ZWN1dG9yOkxPQ0FM',
    LinkedIn: 'TGlua2VkSW5PSURDOkxpbmtlZElu',
    MagicLink: 'TWFnaWNMaW5rQXV0aGVudGljYXRvcjpMT0NBTA',
    Microsoft: 'T3BlbklEQ29ubmVjdEF1dGhlbnRpY2F0b3I6TWljcm9zb2Z0',
    Passkey: 'RklET0F1dGhlbnRpY2F0b3I6TE9DQUw',
    PushNotification: 'cHVzaC1ub3RpZmljYXRpb24tYXV0aGVudGljYXRvcjpMT0NBTA',
    SignInWithEthereum: 'T3BlbklEQ29ubmVjdEF1dGhlbnRpY2F0b3I6U2lnbiBJbiBXaXRoIEV0aGVyZXVt',
    SmsOtp: 'c21zLW90cC1hdXRoZW50aWNhdG9yOkxPQ0FM',
    Totp: 'dG90cDpMT0NBTA',
    UsernamePassword: 'QmFzaWNBdXRoZW50aWNhdG9yOkxPQ0FM',
  },
} as const;

export default ApplicationNativeAuthenticationConstants;
