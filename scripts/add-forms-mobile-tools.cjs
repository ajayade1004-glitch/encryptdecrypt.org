const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../public/assets/data/tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

const formTools = [
  { name: 'HTML Form Generator', desc: 'Generate complete, semantic HTML5 forms with accessible labels, inputs, selects, and submit buttons.' },
  { name: 'Contact Form HTML Generator', desc: 'Generate responsive 2-column contact forms with required validation and styled message boxes.' },
  { name: 'Login Form UI Generator', desc: 'Generate accessible authentication login forms with email/password and remember-me controls.' },
  { name: 'Registration Form UI Generator', desc: 'Generate multi-field user registration forms with password strength helper guidance.' },
  { name: 'Search Form Generator', desc: 'Generate accessible search forms with SVG iconography and clear buttons.' },
  { name: 'Newsletter Form Generator', desc: 'Generate clean inline newsletter subscription cards with email inputs.' },
  { name: 'Feedback Form Generator', desc: 'Generate product feedback forms with 5-star rating radio inputs and comments.' },
  { name: 'Survey Form Generator', desc: 'Generate multi-step survey forms with categorized fieldsets and question legends.' },
  { name: 'HTML Table Generator', desc: 'Generate responsive, styled HTML5 data tables with semantic thead, tbody, and status badges.' },
  { name: 'Responsive Navigation Generator', desc: 'Generate mobile-responsive navigation bars with accessible hamburger menus and CTA links.' },
  { name: 'Breadcrumb UI Generator', desc: 'Generate Schema.org BreadcrumbList microdata and accessible breadcrumb navigation.' },
  { name: 'Pagination UI Generator', desc: 'Generate accessible pagination controls with current page states and previous/next actions.' },
  { name: 'Pricing Table Generator', desc: 'Generate multi-tier pricing cards with featured badges, comparison lists, and action buttons.' },
  { name: 'FAQ Accordion Generator', desc: 'Generate accessible HTML5 details/summary FAQ accordions with Schema.org FAQPage structured data.' },
  { name: 'Responsive Card Grid Generator', desc: 'Generate responsive 3-column UI card grids with icons, descriptions, and action links.' },
  { name: 'Modal Dialog HTML Generator', desc: 'Generate native HTML5 <dialog> modal popups with backdrop controls and focus traps.' },
  { name: 'Accessible Dropdown Generator', desc: 'Generate WAI-ARIA compliant dropdown selectors with aria-labelledby bindings.' },
  { name: 'Form Validation Rules Generator', desc: 'Generate standard regular expression validation rules for passwords, emails, phones, and SemVer.' },
  { name: 'HTML Input Pattern Generator', desc: 'Generate HTML5 pattern attribute regexes for usernames, credit cards, ZIP codes, and IPs.' },
  { name: 'Responsive Footer Generator', desc: 'Generate semantic 3-column responsive web footers with links and copyright.' },
];

const mobileTools = [
  { name: 'Android dp to px Converter', desc: 'Calculate physical pixel dimensions from Android density-independent pixels (dp) across ldpi to xxxhdpi.' },
  { name: 'Android px to dp Converter', desc: 'Convert screen pixel values back into density-independent pixels (dp) for layout XML.' },
  { name: 'Android sp to px Converter', desc: 'Convert scale-independent typography pixels (sp) to px across standard and accessibility font scales.' },
  { name: 'Android Color Resource Generator', desc: 'Generate standard Android colors.xml resources with primary, dark, and status colors.' },
  { name: 'Android String Resource Generator', desc: 'Generate Android strings.xml resource files with formatted placeholders (%1$s, %1$d).' },
  { name: 'Android Dimension Resource Generator', desc: 'Generate standard Android dimens.xml files for spacing, margins, corner radii, and text sizes.' },
  { name: 'Android XML to Kotlin Model Helper', desc: 'Generate Kotlin data classes and Parcelable models from Android XML layouts.' },
  { name: 'Android Package Name Validator', desc: 'Validate Android Application IDs and package names against Google Play Store rules and Java keywords.' },
  { name: 'Android Version Code Calculator', desc: 'Calculate integer Android versionCode from semantic versionName (Major.Minor.Patch).' },
  { name: 'Android Version Name Comparator', desc: 'Compare installed version names against latest releases to detect required app updates.' },
  { name: 'Android Manifest Permission Reference', desc: 'Quick reference for AndroidManifest.xml permissions (Internet, Biometric, Camera, Notifications).' },
  { name: 'Jetpack Compose Color Palette Generator', desc: 'Generate Jetpack Compose Color definitions for Material Theme integration.' },
  { name: 'Jetpack Compose Button Template Generator', desc: 'Generate modern Jetpack Compose Button composables with custom colors and elevation.' },
  { name: 'Jetpack Compose Card Template Generator', desc: 'Generate Jetpack Compose Card composables with typography hierarchy and elevation.' },
  { name: 'iOS Point to Pixel Calculator', desc: 'Convert iOS point (pt) values to physical pixels across @1x, @2x, and @3x Super Retina screens.' },
  { name: 'iOS Color Asset Generator', desc: 'Generate Contents.json color asset catalogs for Xcode with light and dark mode appearances.' },
  { name: 'App Icon Size Planner', desc: 'Plan app icon sizes for Apple iOS App Store, Spotlight, Settings, and Google Play Store.' },
  { name: 'App Screenshot Size Planner', desc: 'Inspect screenshot resolution requirements for 6.9", 6.7", 6.5", 5.5" iPhones, iPads, and Android phones.' },
  { name: 'App Store Listing Character Counter', desc: 'Validate title (30 chars), subtitle (30 chars), and short descriptions against Apple and Google limits.' },
  { name: 'Mobile Safe Area Calculator', desc: 'Calculate safe area insets for Dynamic Island, notch devices, and gesture navigation bars.' },
];

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

let addedCount = 0;

function addCategoryTools(catSlug, catName, toolList) {
  toolList.forEach(t => {
    const slug = slugify(t.name);
    const existing = tools.find(x => x.slug === slug || x.id === slug);
    if (!existing) {
      tools.push({
        id: slug,
        name: t.name,
        slug: slug,
        category: catSlug,
        categoryName: catName,
        shortDesc: t.desc,
        desc: t.desc,
        inputType: 'textarea',
        keywords: [t.name.toLowerCase(), catSlug, catName.toLowerCase(), 'online', 'free', 'developer']
      });
      addedCount++;
    }
  });
}

addCategoryTools('web-forms-ui-generators', 'Web Forms & UI Generators', formTools);
addCategoryTools('mobile-app-development-tools', 'Mobile & App Development Tools', mobileTools);

fs.writeFileSync(toolsPath, JSON.stringify(tools, null, 2), 'utf8');
console.log(`Added ${addedCount} tools. Total tools in database: ${tools.length}`);
