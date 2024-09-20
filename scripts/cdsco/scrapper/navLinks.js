const menuItems = [
    // {
    //     name: "About Us",
    //     link: "/opencms/opencms/en/About-us/",
    //     submenus: [
    //         {
    //             name: "Central Drug Testing Laboratories",
    //             link: "/opencms/opencms/en/About-us/Laboratories/",
    //         },
    //         { name: "Functions", link: "/opencms/opencms/en/About-us/Functions/" },
    //         { name: "Introduction", link: "/opencms/opencms/en/About-us/Introduction/" },
    //         { name: "Seniority List", link: "/opencms/opencms/en/About-us/Seniority-List/" },
    //     ],
    // },
    // {
    //     name: "Act & Rules",
    //     link: "/opencms/opencms/en/Acts-and-rules/",
    //     submenus: [
    //         {
    //             name: "Drugs and Cosmetics Act, 1940",
    //             link: "/opencms/opencms/en/Acts-and-rules/Drugs-and-Cosmetics-Act/",
    //             pageType: "table1",

    // tableType: "typeA",
    //         },
    //         {
    //             name: "Drugs Rules, 1945",
    //             link: "/opencms/opencms/en/Acts-and-rules/Drugs-Rules/",
    //             pageType: "table1",

    // tableType: "typeA",
    //         },
    //         {
    //             name: "Medical Devices Rules, 2017",
    //             link: "/opencms/opencms/en/Acts-and-rules/Medical-Devices-Rules/",
    //             pageType: "table1",

    // tableType: "typeA",
    //         },
    //         {
    //             name: "New Drugs and Clinical Trials Rules, 2019",
    //             link: "/opencms/opencms/en/Acts-and-rules/New-Drugs/",
    //             pageType: "table1",

    // tableType: "typeA",
    //         },
    //         {
    //             name: "Cosmetics Rules, 2020",
    //             link: "/opencms/opencms/en/Acts-and-rules/Cosmetics-Rules/",
    //             pageType: "table1",

    // tableType: "typeA",
    //         },
    //         {
    //             name: "Advisories/Notices/O.Ms./Orders",
    //             link: "/opencms/opencms/en/Acts-and-rules/Advisories_NO/",
    //             pageType: "table1",

    // tableType: "typeA",
    //         },
    //         {
    //             name: "Final Notifications",
    //             link: "/opencms/opencms/en/Acts-and-rules/Final-Notifications/",
    //             pageType: "table1",

    // tableType: "typeA",
    //         },
    //         {
    //             name: "Draft Notifications",
    //             link: "/opencms/opencms/en/Acts-and-rules/Draft-Notifications/",
    //             pageType: "table1",

    // tableType: "typeA",
    //         },
    //         {
    //             name: "Guidance documents",
    //             link: "/opencms/opencms/en/Acts-and-rules/Guidance-documents/",
    //             pageType: "table1",

    // tableType: "typeA",
    //         },
    //     ],
    // },
    // {
    //     name: "BA/BE",
    //     link: "/opencms/opencms/en/bioequi_bioavail/",
    //     submenus: [{ name: "BA/BE", link: "/opencms/opencms/en/bioequi_bioavail/index.html" }],
    // },
    // {
    //     name: "Clinical Trial",
    //     link: "/opencms/opencms/en/Clinical-Trial/",
    //     submenus: [
    //         {
    //             name: "Ethics Committee",
    //             link: "/opencms/opencms/en/Clinical-Trial/Ethics-Committee/",
    //         },
    //         {
    //             name: "Global Clinical Trial",
    //             link: "/opencms/opencms/en/Clinical-Trial/Global-Clinical-Trial/",
    //         },
    //         { name: "Serious Adverse Event", link: "/opencms/opencms/en/Clinical-Trial/SAE/" },
    //     ],
    // },
    // {
    //     name: "Biologics",
    //     link: "/opencms/opencms/en/biologicals/",
    //     submenus: [
    //         { name: "Vaccines", link: "/opencms/opencms/en/biologicals/Vaccines/" },
    //         { name: "Blood Products", link: "/opencms/opencms/en/biologicals/Blood-Products/" },
    //         { name: "rDNA", link: "/opencms/opencms/en/biologicals/rDNA/" },
    //         {
    //             name: "Stem Cells and Cell based products",
    //             link: "/opencms/opencms/en/biologicals/Stem-cells-and-Cell-based-Products/",
    //         },
    //     ],
    // },
    // {
    //     name: "Cosmetics",
    //     link: "/opencms/opencms/en/Cosmetics/",
    //     submenus: [{ name: "Cosmetics", link: "/opencms/opencms/en/Cosmetics/cosmetics/" }],
    // },
    // {
    //     name: "DTAB-DCC",
    //     link: "/opencms/opencms/en/dcc-dtab-committee",
    // },
    // {
    //     name: "Drugs",
    //     link: "/opencms/opencms/en/Drugs/",
    //     submenus: [
    //         { name: "Fixed Dose Combination", link: "/opencms/opencms/en/Drugs/FDC/" },
    //         {
    //             name: "Investigational New Drugs",
    //             link: "/opencms/opencms/en/Drugs/Investigational-New-Drugs-/",
    //         },
    //         { name: "New Drugs", link: "/opencms/opencms/en/Drugs/New-Drugs/" },
    //         {
    //             name: "Subsequent New Drugs",
    //             link: "/opencms/opencms/en/Drugs/Subsequent-New-Drugs/",
    //         },
    //     ],
    // },
    // {
    //     name: "International Cell",
    //     link: "/opencms/opencms/en/international/",
    // },
    // {
    //     name: "Medical Devices & Diagnostics",
    //     link: "/opencms/opencms/en/Medical-Device-Diagnostics/",
    //     submenus: [
    //         {
    //             name: "InVitro Diagnostics",
    //             link: "/opencms/opencms/en/Medical-Device-Diagnostics/InVitro-Diagnostics/",
    //         },
    //         {
    //             name: "Medical Device",
    //             link: "/opencms/opencms/en/Medical-Device-Diagnostics/Medical-Device-Diagnostics/",
    //         },
    //     ],
    // },
    // {
    //     name: "Notifications",
    //     link: "/opencms/opencms/en/Notifications/",
    //     submenus: [
    //         {
    //             name: "Recruitment & Rules",
    //             link: "/opencms/opencms/en/Notifications/page/",
    //             pageType: "table1",
    //             tableType: "typeA",
    //         },
    //         {
    //             name: "Alerts",
    //             link: "/opencms/opencms/en/Notifications/Alerts/",
    //             pageType: "table1",
    //             tableType: "typeA",
    //         },
    //         {
    //             name: "Archive",
    //             link: "/opencms/opencms/en/Notifications/Archive/",
    //             pageType: "table1",
    //             tableType: "typeB",
    //         },
    //         {
    //             name: "Circulars",
    //             link: "/opencms/opencms/en/Notifications/Circulars/",
    //             pageType: "table1",
    //             tableType: "typeA",
    //         },
    //         {
    //             name: "Downloads/Documents & Publications",
    //             link: "/opencms/opencms/en/Notifications/documents/",
    //             pageType: "table1",
    //             tableType: "typeC",
    //         },
    //         {
    //             name: "Events",
    //             link: "/opencms/opencms/en/Notifications/Events/",
    //             pageType: "table1",
    //             tableType: "typeD",
    //         },
    //         {
    //             name: "Gazette Notifications",
    //             link: "/opencms/opencms/en/Notifications/Gazette-Notifications/",
    //             pageType: "table1",
    //             tableType: "typeA",
    //         },
    //         {
    //             name: "Public Notices",
    //             link: "/opencms/opencms/en/Notifications/Public-Notices/",
    //             pageType: "table1",
    //             tableType: "typeA",
    //         },
    //         {
    //             name: "Prescribing Information",
    //             link: "/opencms/opencms/en/Notifications/Prescribing-Information/",
    //             pageType: "table1",
    //             tableType: "typeE",
    //         },
    //         {
    //             name: "Adverse Drug Reaction related Notifications",
    //             link: "/opencms/opencms/en/Notifications/Adverse-Drug-Reaction-related-Notifications/",
    //             pageType: "table1",
    //             tableType: "typeE",
    //         },
    //         {
    //             name: "Tenders",
    //             link: "/opencms/opencms/en/Notifications/Tender/",
    //             pageType: "table1",
    //             tableType: "typeA",
    //         },
    //         {
    //             name: "Vacancies",
    //             link: "/opencms/opencms/en/Notifications/Vacancy/",
    //             pageType: "table1",
    //             tableType: "typeA",
    //         },
    //     ],
    // },
    {
        name: "Committees",
        link: "/opencms/opencms/en/Committees/",
        submenus: [
            // {
            //     name: "ASR Committee",
            //     link: "/opencms/opencms/en/Committees/ASR-Committee/",
            //     pageType: "table1",
            //     tableType: "typeA",
            // },
            // {
            //     name: "Apex Committee",
            //     link: "/opencms/opencms/en/Committees/Apex-Committee/",
            //     pageType: "table1",
            //     tableType: "typeA",
            // },
            // {
            //     name: "DCC",
            //     link: "/opencms/opencms/en/Committees/DCC/",
            //     pageType: "table1",
            //     tableType: "typeA",
            // },
            // {
            //     name: "DTAB",
            //     link: "/opencms/opencms/en/Committees/DTAB/",
            //     pageType: "table1",
            //     tableType: "typeA",
            // },
            // {
            //     name: "IND",
            //     link: "/opencms/opencms/en/Committees/IND/",
            //     pageType: "table1",
            //     tableType: "typeA",
            // },
            // {
            //     name: "Miscellaneous",
            //     link: "/opencms/opencms/en/Committees/Miscellaneous/",
            //     pageType: "table1",
            //     tableType: "typeA",
            // },
            // {
            //     name: "NDAC",
            //     link: "/opencms/opencms/en/Committees/NDAC/",
            //     pageType: "table1",
            //     tableType: "typeA",
            // },
            {
                name: "SEC",
                link: "/opencms/opencms/en/Committees/SEC/",
                pageType: "table1",
                tableType: "typeE",
            },
            // {
            //     name: "Technical Committee",
            //     link: "/opencms/opencms/en/Committees/Technical-Committee/",
            //     pageType: "table1",

            //     tableType: "typeA",
            // },
        ],
    },
    // {
    //     name: "PRO",
    //     link: "/opencms/opencms/en/PRO/",
    // },
    // {
    //     name: "PSUR/PV/AEFI",
    //     link: "/opencms/opencms/en/PSUR_PV_AEFI/",
    // },
];

module.exports = menuItems;
