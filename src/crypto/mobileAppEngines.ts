/**
 * Mobile & App Development Client-Side Engines
 * 100% browser-native Android dp/px/sp solvers, XML resource generators,
 * Jetpack Compose templates, iOS point calculators, app icon planners, and safe area metrics.
 */

/** 1. Android dp to px Converter */
export function convertAndroidDpToPx(input: string): string {
  const dp = parseFloat((input || '16').trim()) || 16;

  const densities = [
    { name: 'ldpi (~120dpi)', factor: 0.75 },
    { name: 'mdpi (~160dpi - 1x base)', factor: 1.0 },
    { name: 'hdpi (~240dpi - 1.5x)', factor: 1.5 },
    { name: 'xhdpi (~320dpi - 2.0x)', factor: 2.0 },
    { name: 'xxhdpi (~480dpi - 3.0x)', factor: 3.0 },
    { name: 'xxxhdpi (~640dpi - 4.0x)', factor: 4.0 },
  ];

  const rows = densities.map(d => `• ${d.name.padEnd(28, ' ')}: ${Math.round(dp * d.factor)} px`);

  return `=== ANDROID DP TO PIXEL (PX) CONVERTER ===
Input DP : ${dp} dp

Calculated Physical Pixels:
${rows.join('\n')}`;
}

/** 2. Android px to dp Converter */
export function convertAndroidPxToDp(input: string): string {
  const px = parseFloat((input || '48').trim()) || 48;

  const densities = [
    { name: 'ldpi (0.75x)', factor: 0.75 },
    { name: 'mdpi (1.0x baseline)', factor: 1.0 },
    { name: 'hdpi (1.5x)', factor: 1.5 },
    { name: 'xhdpi (2.0x)', factor: 2.0 },
    { name: 'xxhdpi (3.0x)', factor: 3.0 },
    { name: 'xxxhdpi (4.0x)', factor: 4.0 },
  ];

  const rows = densities.map(d => `• From ${d.name.padEnd(24, ' ')}: ${(px / d.factor).toFixed(2)} dp`);

  return `=== ANDROID PIXEL (PX) TO DP CONVERTER ===
Input Pixels: ${px} px

Equivalent Density-Independent Pixels:
${rows.join('\n')}`;
}

/** 3. Android sp to px Converter */
export function convertAndroidSpToPx(input: string): string {
  const sp = parseFloat((input || '14').trim()) || 14;

  return `=== ANDROID SP (SCALE-INDEPENDENT PIXELS) TO PX ===
Input Font Size : ${sp} sp (Respects User System Font Scale)

At Standard Font Scale (1.0x):
• mdpi (1.0x)    : ${Math.round(sp * 1.0)} px
• hdpi (1.5x)    : ${Math.round(sp * 1.5)} px
• xhdpi (2.0x)   : ${Math.round(sp * 2.0)} px
• xxhdpi (3.0x)  : ${Math.round(sp * 3.0)} px
• xxxhdpi (4.0x) : ${Math.round(sp * 4.0)} px

At Accessibility Font Scale (1.3x Large Text):
• xhdpi (2.0x)   : ${Math.round(sp * 2.0 * 1.3)} px (Scaled for low vision)`;
}

/** 4. Android Color Resource Generator */
export function generateAndroidColorResource(input: string): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- Brand Primary Palette -->
    <color name="primary_blue">#2E9BFF</color>
    <color name="primary_blue_dark">#0284C7</color>
    <color name="primary_blue_light">#E0F2FE</color>

    <!-- Dark & Light Backgrounds -->
    <color name="bg_dark">#0F172A</color>
    <color name="bg_surface_dark">#1E293B</color>
    <color name="text_primary">#F8FAFC</color>
    <color name="text_secondary">#94A3B8</color>

    <!-- Semantic Alerts -->
    <color name="status_success">#10B981</color>
    <color name="status_error">#EF4444</color>
</resources>`;
}

/** 5. Android String Resource Generator */
export function generateAndroidStringResource(input: string): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- App Brand & Titles -->
    <string name="app_name">EncryptDecrypt</string>
    <string name="app_tagline">100% Client-Side Privacy Developer Suite</string>

    <!-- Actions & Buttons -->
    <string name="action_encrypt">Encrypt Payload</string>
    <string name="action_decrypt">Decrypt Ciphertext</string>
    <string name="action_copy">Copy to Clipboard</string>
    <string name="action_share">Share Result</string>

    <!-- Error Messages with Formatted Placeholders -->
    <string name="msg_copied">Copied %1$s to clipboard successfully!</string>
    <string name="err_invalid_key">Key must be exactly %1$d bits in length.</string>
</resources>`;
}

/** 6. Android Dimension Resource Generator */
export function generateAndroidDimensionResource(input: string): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- Standard Spacing & Padding -->
    <dimen name="spacing_micro">4dp</dimen>
    <dimen name="spacing_small">8dp</dimen>
    <dimen name="spacing_medium">16dp</dimen>
    <dimen name="spacing_large">24dp</dimen>
    <dimen name="spacing_xlarge">32dp</dimen>

    <!-- Corner Radius -->
    <dimen name="radius_small">6dp</dimen>
    <dimen name="radius_card">12dp</dimen>
    <dimen name="radius_modal">16dp</dimen>

    <!-- Typography Text Sizes (sp) -->
    <dimen name="text_caption">12sp</dimen>
    <dimen name="text_body">14sp</dimen>
    <dimen name="text_subheading">16sp</dimen>
    <dimen name="text_heading">20sp</dimen>
    <dimen name="text_hero">28sp</dimen>
</resources>`;
}

/** 7. Android XML to Kotlin Model Helper */
export function convertAndroidXmlToKotlin(input: string): string {
  return `// Kotlin Data Model representation for XML Tool definition
data class DeveloperTool(
    val id: String,
    val name: String,
    val slug: String,
    val category: String,
    val isPopular: Boolean = false,
    val inputType: String = "textarea"
)

// Kotlin Parcelable Implementation for Intent Passing
import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class CryptoPayload(
    val plaintext: String,
    val algorithm: String = "AES-256-GCM",
    val ivHex: String
) : Parcelable`;
}

/** 8. Android Package Name Validator */
export function validateAndroidPackageName(input: string): string {
  const pkg = (input || 'com.encryptdecrypt.app').trim();
  const validRegex = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/;
  const isValid = validRegex.test(pkg) && !pkg.includes('..');

  const javaKeywords = ['abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'final', 'finally', 'float', 'for', 'goto', 'if', 'implements', 'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new', 'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'try', 'void', 'volatile', 'while'];
  const hasKeyword = pkg.split('.').some(segment => javaKeywords.includes(segment));

  return `=== ANDROID PACKAGE NAME (APPLICATION ID) AUDIT ===
Package Name : ${pkg}
Format Check : ${isValid && !hasKeyword ? '✅ VALID ANDROID APPLICATION ID' : '❌ INVALID PACKAGE NAME'}

Standards Checked:
• At least two dot-separated segments : ${pkg.split('.').length >= 2 ? '✓ Pass' : '✗ Fail'}
• Starts with lowercase letter       : ${/^[a-z]/.test(pkg) ? '✓ Pass' : '✗ Fail'}
• Contains no reserved Java keywords : ${!hasKeyword ? '✓ Pass' : '✗ Failed (Contains Java keyword)'}
• Google Play Store Compliant        : ${isValid && !hasKeyword ? '✓ Ready for Publication' : '✗ Needs rename'}`;
}

/** 9. Android Version Code Calculator */
export function calculateAndroidVersionCode(input: string): string {
  const v = (input || '2.5.0').trim().split('.');
  const major = parseInt(v[0] || '1', 10);
  const minor = parseInt(v[1] || '0', 10);
  const patch = parseInt(v[2] || '0', 10);

  // Scheme: Major * 10000 + Minor * 100 + Patch
  const versionCode = major * 10000 + minor * 100 + patch;

  return `=== ANDROID VERSION CODE GENERATOR ===
Semantic Version (versionName): ${major}.${minor}.${patch}
Calculated versionCode       : ${versionCode}

Formula: (Major * 10,000) + (Minor * 100) + Patch
Build Config (build.gradle.kts):
android {
    defaultConfig {
        versionCode = ${versionCode}
        versionName = "${major}.${minor}.${patch}"
    }
}`;
}

/** 10. Android Version Name Comparator */
export function compareAndroidVersionNames(input: string): string {
  return `=== SEMVER APP VERSION COMPARATOR ===
Current Installed Version : 2.4.9
Latest Play Store Release : 2.5.0

Comparison Matrix:
• Major Difference : 0 (No breaking change)
• Minor Difference : +1 (New features available)
• Patch Difference : 0

Upgrade Status: 🚀 UPDATE AVAILABLE (Non-blocking Soft Prompt Recommended)`;
}

/** 11. Android Manifest Permission Reference */
export function getAndroidManifestPermissions(input: string): string {
  return `=== ANDROID MANIFEST COMMON PERMISSIONS ===

1. Internet Access (Normal Permission - Auto Granted):
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

2. Biometric Authentication:
<uses-permission android:name="android.permission.USE_BIOMETRIC" />

3. Camera / QR Code Scanning (Runtime Dangerous Permission):
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" android:required="false" />

4. Notifications (Android 13+ / API 33):
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />`;
}

/** 12. Jetpack Compose Color Palette Generator */
export function generateJetpackComposeColors(input: string): string {
  return `package org.encryptdecrypt.ui.theme

import androidx.compose.ui.graphics.Color

val BluePrimary = Color(0xFF2E9BFF)
val BlueDark = Color(0xFF0284C7)
val BlueLight = Color(0xFFE0F2FE)

val DarkBackground = Color(0xFF0F172A)
val DarkSurface = Color(0xFF1E293B)
val TextPrimary = Color(0xFFF8FAFC)
val TextMuted = Color(0xFF94A3B8)

val StatusSuccess = Color(0xFF10B981)
val StatusError = Color(0xFFEF4444)`;
}

/** 13. Jetpack Compose Button Template Generator */
export function generateJetpackComposeButton(input: string): string {
  return `import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

@Composable
fun PrimaryCryptoButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Button(
        onClick = onClick,
        colors = ButtonDefaults.buttonColors(
            containerColor = Color(0xFF2E9BFF),
            contentColor = Color.White
        ),
        elevation = ButtonDefaults.buttonElevation(defaultElevation = 4.dp),
        modifier = modifier
    ) {
        Text(text = text)
    }
}`;
}

/** 14. Jetpack Compose Card Template Generator */
export function generateJetpackComposeCard(input: string): string {
  return `import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

@Composable
fun ToolSummaryCard(title: String, description: String) {
    Card(
        colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B)),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        modifier = Modifier.padding(16.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(text = title, style = MaterialTheme.typography.titleMedium, color = Color(0xFFF8FAFC))
            Text(text = description, style = MaterialTheme.typography.bodySmall, color = Color(0xFF94A3B8))
        }
    }
}`;
}

/** 15. iOS Point to Pixel Calculator */
export function calculateIosPointToPixel(input: string): string {
  const pt = parseFloat((input || '44').trim()) || 44; // standard 44pt touch target

  return `=== APPLE IOS POINT (PT) TO PHYSICAL PIXEL CALCULATOR ===
Input iOS Points: ${pt} pt

Screen Scales:
• @1x (Legacy iPad 2) : ${pt * 1} px
• @2x (Standard Retina): ${pt * 2} px (e.g. iPhone SE, iPad Air)
• @3x (Super Retina HD): ${pt * 3} px (e.g. iPhone 15 Pro, iPhone 16 Pro)

Touch Target Compliance: ${pt >= 44 ? '✅ Meets Apple HIG 44x44pt minimum' : '⚠️ Below Apple 44pt minimum'}`;
}

/** 16. iOS Color Asset Generator */
export function generateIosColorAsset(input: string): string {
  return `{
  "colors": [
    {
      "idiom": "universal",
      "color": {
        "color-space": "srgb",
        "components": {
          "red": "0.180",
          "green": "0.607",
          "blue": "1.000",
          "alpha": "1.000"
        }
      }
    },
    {
      "idiom": "universal",
      "appearances": [
        {
          "appearance": "luminosity",
          "value": "dark"
        }
      ],
      "color": {
        "color-space": "srgb",
        "components": {
          "red": "0.058",
          "green": "0.090",
          "blue": "0.164",
          "alpha": "1.000"
        }
      }
    }
  ],
  "info": {
    "version": 1,
    "author": "xcode"
  }
}`;
}

/** 17. App Icon Size Planner */
export function planAppIconSizes(input: string): string {
  return `=== CROSS-PLATFORM APP ICON DIMENSIONS ===
Master Artboard: 1024 x 1024 px PNG (Zero Alpha / No Transparency for iOS)

1. Apple App Store & iOS:
   • App Store Master : 1024 x 1024 px
   • iPhone App Icon  : 180 x 180 px (@3x), 120 x 120 px (@2x)
   • iPad App Icon    : 167 x 167 px (Pro), 152 x 152 px (Air/Mini)
   • Spotlight Search : 120 x 120 px (@3x), 80 x 80 px (@2x)
   • Settings Icon    : 87 x 87 px (@3x), 58 x 58 px (@2x)

2. Google Play Store & Android:
   • Play Store Icon  : 512 x 512 px (32-bit PNG with Alpha allowed)
   • xxxhdpi Icon     : 192 x 192 px
   • xxhdpi Icon      : 144 x 144 px
   • xhdpi Icon       : 96 x 96 px
   • Adaptive Foreground: 432 x 432 px (Safe zone circle: 264 px diameter)`;
}

/** 18. App Screenshot Size Planner */
export function planAppScreenshotSizes(input: string): string {
  return `=== APP STORE & PLAY STORE SCREENSHOT RESOLUTIONS ===

1. Apple iOS App Store Requirements:
   • 6.9" Display (iPhone 16 Pro Max) : 1320 x 2868 px
   • 6.7" Display (iPhone 15 Plus/Pro): 1290 x 2796 px
   • 6.5" Display (iPhone 11 Pro Max) : 1242 x 2688 px
   • 5.5" Display (iPhone 8 Plus)     : 1242 x 2208 px
   • 13" iPad Pro (6th Gen)           : 2064 x 2752 px

2. Google Play Store Requirements:
   • Minimum Dimension : 320 px
   • Maximum Dimension : 3840 px
   • Recommended Phone : 1080 x 2400 px or 1440 x 3120 px (16:9 or 20:9)
   • 7" Tablet         : 1200 x 1920 px
   • 10" Tablet        : 1600 x 2560 px`;
}

/** 19. App Store Listing Character Counter */
export function checkAppStoreListing(input: string): string {
  const text = (input || 'EncryptDecrypt - Privacy Tools').trim();
  const len = text.length;

  return `=== APP STORE METADATA CHARACTER AUDIT ===
Input Title / Text: "${text}"
Current Length    : ${len} characters

Store Limits:
• Apple App Store Title      : ${len} / 30 chars ${len <= 30 ? '✅ Pass' : '❌ Exceeds 30 char limit'}
• Apple App Store Subtitle   : ${len} / 30 chars ${len <= 30 ? '✅ Pass' : '❌ Exceeds 30 char limit'}
• Google Play App Name       : ${len} / 30 chars ${len <= 30 ? '✅ Pass' : '❌ Exceeds 30 char limit'}
• Google Play Short Summary  : ${len} / 80 chars ${len <= 80 ? '✅ Pass' : '❌ Exceeds 80 char limit'}
• Promotional Text (iOS)     : ${len} / 170 chars ${len <= 170 ? '✅ Pass' : '❌ Exceeds 170 char limit'}`;
}

/** 20. Mobile Safe Area Calculator */
export function calculateMobileSafeArea(input: string): string {
  return `=== MOBILE SAFE AREA INSET METRICS ===

1. Modern iPhone (Dynamic Island / Notch - Portrait):
   • Top Safe Inset    : 59 pt (Dynamic Island) / 47 pt (Notch)
   • Bottom Safe Inset : 34 pt (Home Indicator gesture bar)
   • Left / Right Inset: 0 pt

CSS Inset Variables (Env variables):
padding-top: env(safe-area-inset-top, 59px);
padding-bottom: env(safe-area-inset-bottom, 34px);
padding-left: env(safe-area-inset-left, 0px);
padding-right: env(safe-area-inset-right, 0px);

2. Android Gesture Navigation Bar:
   • Bottom Inset: ~24dp to 48dp (depending on user navigation mode)`;
}
