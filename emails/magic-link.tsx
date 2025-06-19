import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";
import { sendEmail } from "@/lib/email";
import { APP_NAME } from "@/lib/config/constants";
import { UAParser } from "ua-parser-js";

interface DeviceInfo {
  browser?: string;
  os?: string;
  device?: string;
  location?: string;
  ip?: string;
}

const MagicLinkEmailBody = ({
  email,
  url,
  deviceInfo,
}: {
  email: string;
  url: string;
  deviceInfo?: DeviceInfo;
}) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>
          {`
            * {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              box-sizing: border-box;
            }

            blockquote,h1,h2,h3,img,li,ol,p,ul {
              margin-top: 0;
              margin-bottom: 0;
            }

            .email-wrapper {
              background-color: #f8fafc;
              padding: 40px 20px;
            }

            .email-content {
              background-color: #ffffff;
              border-radius: 12px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }

            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 32px 40px;
              text-align: center;
            }

            .content {
              padding: 40px;
            }

            .footer {
              background-color: #f8fafc;
              padding: 24px 40px;
              border-top: 1px solid #e2e8f0;
            }

            @media only screen and (max-width: 600px) {
              .email-wrapper {
                padding: 20px 10px;
              }
              .header, .content, .footer {
                padding-left: 24px;
                padding-right: 24px;
              }
              .header {
                padding-top: 24px;
                padding-bottom: 24px;
              }
              .content {
                padding-top: 32px;
                padding-bottom: 32px;
              }
              h1 {
                font-size: 24px !important;
                line-height: 32px !important;
              }
              p, a {
                font-size: 14px !important;
                line-height: 22px !important;
              }
              .cta-button {
                font-size: 16px !important;
                padding: 14px 28px !important;
              }
            }
          `}
        </style>
      </Head>
      <Preview>
        Click the secure button below to complete your sign-in process. Your
        secure sign-in link for {APP_NAME}
      </Preview>
      <Body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#f8fafc",
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <div className="email-wrapper">
          <Container
            className="email-content"
            style={{
              maxWidth: "600px",
              width: "100%",
              margin: "0 auto",
              fontFamily:
                "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            }}
          >
            {/* Header */}
            <div className="header">
              <Heading
                as="h1"
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  lineHeight: "36px",
                  color: "#ffffff",
                  margin: "0",
                  textAlign: "center",
                }}
              >
                Welcome to {APP_NAME}
              </Heading>
              <Text
                style={{
                  fontSize: "16px",
                  lineHeight: "24px",
                  color: "#e2e8f0",
                  margin: "8px 0 0 0",
                  textAlign: "center",
                }}
              >
                Your secure sign-in link is ready
              </Text>
            </div>

            {/* Main Content */}
            <div className="content">
              <Text
                style={{
                  fontSize: "16px",
                  lineHeight: "26px",
                  margin: "0 0 24px 0",
                  color: "#374151",
                  textAlign: "left",
                }}
              >
                Hello,
              </Text>

              <Text
                style={{
                  fontSize: "16px",
                  lineHeight: "26px",
                  margin: "0 0 24px 0",
                  color: "#374151",
                  textAlign: "left",
                }}
              >
                We received a request to sign in to your {APP_NAME} account.
                Click the secure button below to complete your sign-in process.
              </Text>

              {/* CTA Button */}
              <div style={{ textAlign: "center", margin: "32px 0" }}>
                <Link
                  className="cta-button"
                  style={{
                    display: "inline-block",
                    lineHeight: "1",
                    textDecoration: "none",
                    color: "#ffffff",
                    backgroundColor: "#4f46e5",
                    padding: "16px 32px",
                    fontSize: "16px",
                    fontWeight: "600",
                    borderRadius: "8px",
                    textAlign: "center",
                    transition: "all 0.2s ease",
                  }}
                  href={url}
                >
                  Sign In to {APP_NAME}
                </Link>
              </div>

              {/* Device and Location Info */}
              {deviceInfo && (
                <div
                  style={{
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "16px",
                    margin: "24px 0",
                  }}
                >
                  <Text
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      margin: "0 0 8px 0",
                    }}
                  >
                    Sign-in Request Details:
                  </Text>
                  {deviceInfo.browser && deviceInfo.os && (
                    <Text
                      style={{
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: "#6b7280",
                        margin: "0 0 4px 0",
                      }}
                    >
                      <strong>Device:</strong> {deviceInfo.browser} on{" "}
                      {deviceInfo.os}
                    </Text>
                  )}
                  {deviceInfo.location && (
                    <Text
                      style={{
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: "#6b7280",
                        margin: "0 0 4px 0",
                      }}
                    >
                      <strong>Location:</strong> {deviceInfo.location}{" "}
                      (approximate)
                    </Text>
                  )}
                  {deviceInfo.location && deviceInfo.ip && (
                    <Text
                      style={{
                        fontSize: "12px",
                        lineHeight: "18px",
                        color: "#9ca3af",
                        margin: "0",
                      }}
                    >
                      IP: {deviceInfo.ip}
                    </Text>
                  )}
                </div>
              )}

              <Text
                style={{
                  fontSize: "14px",
                  lineHeight: "22px",
                  margin: "32px 0 0 0",
                  color: "#6b7280",
                  textAlign: "center",
                  padding: "16px",
                  backgroundColor: "#f9fafb",
                  borderRadius: "6px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <strong>Security Notice:</strong> This link will expire in 15
                minutes for your security. If you didn't request this sign-in,
                please ignore this email.
              </Text>

              <Text
                style={{
                  fontSize: "14px",
                  lineHeight: "22px",
                  margin: "24px 0 0 0",
                  color: "#6b7280",
                  textAlign: "left",
                }}
              >
                If the button doesn't work, you can copy and paste this link
                into your browser:
              </Text>

              <Text
                style={{
                  fontSize: "12px",
                  lineHeight: "18px",
                  margin: "8px 0 0 0",
                  color: "#4f46e5",
                  textAlign: "left",
                  wordBreak: "break-all",
                  padding: "8px",
                  backgroundColor: "#f8fafc",
                  borderRadius: "4px",
                }}
              >
                {url}
              </Text>
            </div>

            {/* Footer */}
            <div className="footer">
              <Text
                style={{
                  fontSize: "12px",
                  lineHeight: "18px",
                  margin: "0 0 8px 0",
                  color: "#6b7280",
                  textAlign: "center",
                }}
              >
                This email was sent to{" "}
                <Link
                  href={`mailto:${email}`}
                  style={{
                    color: "#4f46e5",
                    textDecoration: "none",
                    fontWeight: "500",
                  }}
                >
                  {email}
                </Link>
              </Text>

              <Text
                style={{
                  fontSize: "12px",
                  lineHeight: "18px",
                  margin: "0",
                  color: "#9ca3af",
                  textAlign: "center",
                }}
              >
                © {new Date().getFullYear()} {APP_NAME}. All rights reserved. |{" "}
                {currentDate}
              </Text>
            </div>
          </Container>
        </div>
      </Body>
    </Html>
  );
};

function parseDeviceInfo(request?: Request): DeviceInfo | undefined {
  if (!request) return undefined;

  const userAgent = request.headers.get("user-agent");
  if (!userAgent) return undefined;

  const ua = new UAParser(userAgent);
  const browser = ua.getBrowser();
  const os = ua.getOS();
  const device = ua.getDevice();

  // Get IP address from various headers
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    undefined;

  // Extract location from Vercel's geo headers if available
  const city = request.headers.get("x-vercel-ip-city");
  const region = request.headers.get("x-vercel-ip-country-region");
  const country = request.headers.get("x-vercel-ip-country");

  let location: string | undefined;
  if (city && region && country) {
    location = `${decodeURIComponent(city)}, ${decodeURIComponent(region)}, ${decodeURIComponent(country)}`;
  } else if (country) {
    location = decodeURIComponent(country);
  }

  return {
    browser: browser.name,
    os: os.name,
    device:
      device.type === "mobile"
        ? "Mobile"
        : device.type === "tablet"
          ? "Tablet"
          : "Desktop",
    location,
    ip: ip?.split(",")[0]?.trim(), // Take first IP if multiple
  };
}

export async function sendMagicLink(
  email: string,
  url: string,
  request?: Request,
) {
  try {
    const deviceInfo = parseDeviceInfo(request);

    const res = await sendEmail(
      email,
      `Your secure sign-in link for ${APP_NAME}`,
      <>
        <MagicLinkEmailBody email={email} url={url} deviceInfo={deviceInfo} />
      </>,
    );
    return res;
  } catch (error) {
    return error;
  }
}
