/* Floor.DSGN — Hebrew translation pack (draft).
 *
 * Status: TIER 1 — index.html only (nav, hero, picker, trust, services,
 * gallery, process, industries, CTA, footer, sticky CTA). ~106 keys.
 *
 * NEEDS NATIVE HEBREW REVIEW BEFORE MERGE.
 *
 * Glossary anchors (per LANGUAGE_STRATEGY_2026-05-12.md):
 *   - Sika / Sikafloor / Floor.DSGN / ComfortFloor / MMA — stay Latin, wrap in <bdi> if surrounded by HE.
 *   - ₪ goes AFTER the number with a space: "380 ₪ למ\"ר" (not "₪380/м²")
 *   - מ"מ = mm,  מ"ר = m²  (using gershayim, the standard IL abbreviation)
 *   - Numerals stay Western (1, 2, 3 — not Hebrew letters)
 *   - אפוקסי / טראצו / מיקרוטופינג — borrowed terms, IL industry standard
 *   - PU-בטון — accepted spelling for polyurethane-cement systems
 *   - Forward-arrow "→" replaced with "←" inside RU/EN strings, because in RTL the
 *     visual "next/forward" direction is right-to-left.
 *
 * Falls back to: HTML default text when key missing (the engine in
 * translations.js leaves the element untouched if translations[lang][key]
 * is absent). HTML defaults are English — acceptable bilingual fallback.
 */

(function () {
    if (typeof translations === 'undefined') {
        console.warn('[he-translations] translations object missing — load translations.js first.');
        return;
    }

    translations.he = {
        // General
        language: "שפה",

        // Navigation
        nav_home: "בית",
        nav_floors: "רצפות",
        nav_projects: "פרויקטים",
        nav_about: "אודות",
        nav_blog: "בלוג",
        nav_contact: "צור קשר",

        // Industries (used on home + materials)
        industries_subtitle: "ענפים שאנו משרתים",
        industries_title: "מהימנים במגוון מגזרים",
        industries_note: "מגזרים שעבורם מתוכננות מערכות הרצפה שלנו. הלוגואים המוצגים הם נקודות התייחסות תעשייתיות, לא הצהרה על קשרי לקוח.",
        industry_food: "מזון ומשקאות",
        industry_pharma: "תעשייה פרמצבטית",
        industry_logistics: "לוגיסטיקה",
        industry_retail: "ריטייל",
        industry_hospitality: "אירוח ומלונאות",

        // Process (home page)
        process_subtitle: "התהליך שלנו",
        process_title: "איך אנחנו עובדים",
        process_step1_title: "ייעוץ",
        process_step1_text: "ביקור חינם באתר. בודקים תנאים, מבררים דרישות, ממליצים על פתרונות.",
        process_step2_title: "הצעת מחיר",
        process_step2_text: "אומדן מפורט תוך 48 שעות. מחיר קבוע, ללא תשלומים נסתרים, לוחות זמנים ברורים.",
        process_step3_title: "הכנת מצע",
        process_step3_text: "הכנת המצע, תיקון סדקים, בדיקת רטיבות. הבסיס לתוצאה מושלמת.",
        process_step4_title: "יישום",
        process_step4_text: "יישום מקצועי על-ידי צוותים מוסמכים. פרויקט טיפוסי: 3–7 ימים.",
        process_step5_title: "אחריות",
        process_step5_text: "תנאי האחריות נקבעים לפי המערכת הנבחרת ונתמכים בהמלצות תחזוקה.",

        // CTA (home page)
        cta_title: "מוכנים להתחיל?",
        cta_text: "ייעוץ חינם, ביקור באתר ואומדן מפורט תוך 48 שעות.",
        cta_btn_quote: "אומדן חינם",
        cta_btn_call: "התקשרו עכשיו",

        // Hero3D — the live 3D hero block on index.html
        home_hero3d_eyebrow: "Floor.DSGN · 3D Configurator · v2",
        home_hero3d_h1: "הרכיבו את הרצפה שלכם<br><em>בתלת-ממד — ואחר-כך אנחנו נרצף אותה.</em>",
        home_hero3d_lede: "בנאי WebGL עם טקסטורות PBR אמיתיות. 10 מערכות — טראצו, אפוקסי, מיקרוטופינג, בטון, PU-בטון, MMA, גומי, ComfortFloor. שנו חומר, עובי, צבע, אגרגט — קבלו נוסחת הזמנה ואומדן מדויק.",
        home_hero3d_btn_primary: "פתיחת קונפיגורטור תלת-ממד",
        home_hero3d_btn_ghost: "כל המערכות",
        home_hero3d_decision: "לא בטוחים? איתור מערכת ב-6 שאלות ←",
        home_hero3d_spec_materials: "חומרים",
        home_hero3d_spec_textures: "טקסטורות אמיתיות",
        home_hero3d_spec_quote: "עד אומדן",
        home_hero3d_caption: "תצוגה מקדימה של הקונפיגורטור האמיתי · לחיצה תפתח את הסצנה המלאה",

        // Picker (system tiles)
        home_picker_eyebrow: "Floor.DSGN · ישראל · הנדסה",
        home_picker_h1: "בחרו <em>מערכת</em>",
        home_picker_lede: "שמונה משפחות של רצפות תעשייתיות ועיצוביות. בתוך כל אחת — וריאציות לפי עומס, עובי ומחיר. לא בטוחים — עברו <a href=\"decision-tool.html\" class=\"fx-picker__inline-link\">איתור מערכת ב-6 שאלות</a>.",

        home_tile_epoxy_tag: "תעשייתיות",
        home_tile_epoxy_name: "אפוקסי",
        home_tile_epoxy_meta: "5 מערכות · 0.5–12 מ\"מ · החל מ-140 ₪ למ\"ר",
        home_tile_terrazzo_tag: "עיצוביות",
        home_tile_terrazzo_name: "טראצו",
        home_tile_terrazzo_meta: "4 מערכות · 8–20 מ\"מ · החל מ-380 ₪ למ\"ר",
        home_tile_micro_tag: "דקורטיביות",
        home_tile_micro_name: "מיקרוטופינג",
        home_tile_micro_meta: "3 מערכות · 2–3 מ\"מ · החל מ-280 ₪ למ\"ר",
        home_tile_concrete_tag: "מינימליסטיות",
        home_tile_concrete_name: "בטון מוחלק",
        home_tile_concrete_meta: "3 גימורים · 0 מ\"מ הוספה · החל מ-120 ₪ למ\"ר",
        home_tile_pucement_meta: "4 מערכות · 6–9 מ\"מ · החל מ-380 ₪ למ\"ר · HACCP",
        home_tile_mma_meta: "3 מערכות · 2–4 מ\"מ · התקשות 1–2 שעות · החל מ-320 ₪ למ\"ר",

        home_picker_all: "כל המערכות",
        home_picker_calc: "מחשבון אומדן",

        // Trust strip
        home_trust_t1: "מתקין מוסמך",
        home_trust_l1: "עובדים לפי כרטיסי טכנולוגיה של יצרני חומרים מובילים",
        home_trust_t2: "10 מערכות",
        home_trust_l2: "אפוקסי, טראצו, מיקרוטופינג, PU-בטון, MMA, גומי, ComfortFloor, בטון",
        home_trust_t3: "5 ענפים",
        home_trust_t4: "10 שנים",
        home_trust_l4: "אחריות על המערכת — הידבקות ועמידות לשחיקה",

        // Services preview (home)
        home_services_subtitle: "ההתמחות שלנו",
        home_services_title: "מערכות רצפה",
        home_service_epoxy_label: "תעשייתיות",
        home_service_epoxy: "אפוקסי",
        home_service_micro_label: "דקורטיביות",
        home_service_micro: "מיקרוטופינג",
        home_service_terrazzo_label: "על-זמני",
        home_service_terrazzo: "טראצו",
        home_service_concrete_label: "מודרני",
        home_service_concrete: "בטון",
        home_services_btn: "כל המערכות",

        // Gallery (home)
        home_gallery_subtitle: "רשימות מהשטח",
        home_gallery_title: "עבודות שאפשר להתבונן בהן מקרוב",
        home_gallery_desc: "הכנה, יישום שרף, טקסטורה, קצוות ומשטחי גמר. זוהי שכבת ההוכחה — אותה נמלא בתמונות אמת ובסרטונים קצרים.",
        home_gallery_tag1: "הכנה",
        home_gallery_item1: "פריימר ובקרת מצע",
        home_gallery_tag2: "יישום",
        home_gallery_item2: "שרף חי, צוות ורצפה אמיתית",
        home_gallery_tag3: "יישור",
        home_gallery_item3: "ספייק-רולר ובקרת זרימה",
        home_gallery_tag4: "גמר",
        home_gallery_item4: "תקריב של משטח דקורטיבי",
        home_gallery_tag5: "טקסטורה",
        home_gallery_item5: "אגרגט ודוגמת המשטח",
        home_gallery_tag6: "פנים",
        home_gallery_item6: "חלל מוגמר, לא רק דוגמיות",

        // Footer (shared across all pages)
        footer_tagline: "רצפות מקצועיות ברחבי ישראל. מערכות הנדסיות לתעשייה, מסחר ופרויקטים אדריכליים.",
        footer_systems: "מערכות",
        footer_company: "החברה",
        footer_contact: "יצירת קשר",
        footer_location: "ישראל, תל אביב",
        footer_copyright: "© 2026 Floor.DSGN. כל הזכויות שמורות.",

        // Floor-system nav labels (shared header + footer)
        floors_nav_epoxy: "אפוקסי",
        floors_nav_mma: "MMA",
        floors_nav_pu_cement: "PU-בטון",
        floors_nav_microtopping: "מיקרוטופינג",
        floors_nav_terrazzo: "טראצו",
        floors_nav_concrete: "בטון",

        // Sticky CTA
        sticky_cta: "WhatsApp",
        sticky_cta_sample: "דוגמה",
        sticky_cta_estimate: "אומדן"
    };
})();
