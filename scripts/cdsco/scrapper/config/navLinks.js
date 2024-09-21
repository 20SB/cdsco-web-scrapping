const menuItems = [
    // {
    //     name: "About Us",
    //     link: "/opencms/opencms/en/About-us/",
    //     type: "type1",
    //     submenus: [
    //         {
    //             name: "Central Drug Testing Laboratories",
    //             link: "/opencms/opencms/en/About-us/Laboratories/",
    //             pageType: "type1",
    //         },
    //         {
    //             name: "Functions",
    //             link: "/opencms/opencms/en/About-us/Functions/",
    //             pageType: "type1",
    //             heading: "Functions of CDSCO",
    //         },
    //         {
    //             name: "Introduction",
    //             link: "/opencms/opencms/en/About-us/Introduction/",
    //             pageType: "type1",
    //             heading: "The organization chart",
    //         },
    //     ],
    // },
    // {
    //     name: "Act & Rules",
    //     link: "/opencms/opencms/en/Acts-and-rules/",
    //     type: "type2",
    //     submenus: [
    //         {
    //             name: "Drugs and Cosmetics Act, 1940",
    //             link: "/opencms/opencms/en/Acts-and-rules/Drugs-and-Cosmetics-Act/",
    //             pageType: "table1",
    //             tableType: "typeA",
    //         },
    //         {
    //             name: "Drugs Rules, 1945",
    //             link: "/opencms/opencms/en/Acts-and-rules/Drugs-Rules/",
    //             pageType: "table1",
    //             tableType: "typeA",
    //         },
    //         {
    //             name: "Medical Devices Rules, 2017",
    //             link: "/opencms/opencms/en/Acts-and-rules/Medical-Devices-Rules/",
    //             pageType: "table1",
    //             tableType: "typeA",
    //         },
    //         {
    //             name: "New Drugs and Clinical Trials Rules, 2019",
    //             link: "/opencms/opencms/en/Acts-and-rules/New-Drugs/",
    //             pageType: "table1",
    //             tableType: "typeA",
    //         },
    //         {
    //             name: "Cosmetics Rules, 2020",
    //             link: "/opencms/opencms/en/Acts-and-rules/Cosmetics-Rules/",
    //             pageType: "table1",
    //             tableType: "typeA",
    //         },
    //         {
    //             name: "Advisories/Notices/O.Ms./Orders",
    //             link: "/opencms/opencms/en/Acts-and-rules/Advisories_NO/",
    //             pageType: "table1",
    //             tableType: "typeA",
    //         },
    //         {
    //             name: "Final Notifications",
    //             link: "/opencms/opencms/en/Acts-and-rules/Final-Notifications/",
    //             pageType: "table1",
    //             tableType: "typeA",
    //         },
    //         {
    //             name: "Draft Notifications",
    //             link: "/opencms/opencms/en/Acts-and-rules/Draft-Notifications/",
    //             pageType: "table1",
    //             tableType: "typeA",
    //         },
    //         {
    //             name: "Guidance documents",
    //             link: "/opencms/opencms/en/Acts-and-rules/Guidance-documents/",
    //             pageType: "table1",
    //             tableType: "typeA",
    //         },
    //     ],
    // },
    // {
    //     name: "BA/BE",
    //     link: "/opencms/opencms/en/bioequi_bioavail/",
    //     type: "type3",
    //     submenus: [
    //         {
    //             name: "BA/BE",
    //             link: "/opencms/opencms/en/bioequi_bioavail/index.html",
    //             tableType: "typeA",
    //             pageType: "typeA",
    //         },
    //     ],
    // },
    // {
    //     name: "Clinical Trial",
    //     link: "/opencms/opencms/en/Clinical-Trial/",
    //     type: "type3",
    //     submenus: [
    //         {
    //             name: "Ethics Committee",
    //             link: "/opencms/opencms/en/Clinical-Trial/Ethics-Committee/",
    //             tableType: "typeA",
    //             pageType: "typeA",
    //         },
    //         {
    //             name: "Global Clinical Trial",
    //             link: "/opencms/opencms/en/Clinical-Trial/Global-Clinical-Trial/",
    //             tableType: "typeA",
    //             pageType: "typeA",
    //         },
    //     ],
    // },
    // {
    //     name: "Biologics",
    //     link: "/opencms/opencms/en/biologicals/",
    //     type: "type3",
    //     submenus: [
    //         {
    //             name: "Vaccines",
    //             link: "/opencms/opencms/en/biologicals/Vaccines/",
    //             tableType: "typeA",
    //             pageType: "typeA",
    //         },
    //         {
    //             name: "Blood Products",
    //             link: "/opencms/opencms/en/biologicals/Blood-Products/",
    //             tableType: "typeA",
    //             pageType: "typeB",
    //         },
    //         {
    //             name: "rDNA",
    //             link: "/opencms/opencms/en/biologicals/rDNA/",
    //             tableType: "typeA",
    //             pageType: "typeB",
    //         },
    //         {
    //             name: "Stem Cells and Cell based products",
    //             link: "/opencms/opencms/en/biologicals/Stem-cells-and-Cell-based-Products/",
    //             tableType: "typeA",
    //             pageType: "typeB",
    //         },
    //     ],
    // },
    // {
    //     name: "Cosmetics",
    //     link: "/opencms/opencms/en/Cosmetics/",
    //     type: "type3",
    //     submenus: [
    //         {
    //             name: "Cosmetics",
    //             link: "/opencms/opencms/en/Cosmetics/cosmetics/",
    //             tableType: "typeA",
    //             pageType: "typeA",
    //         },
    //     ],
    // },
    // {
    //     name: "DTAB-DCC",
    //     link: "/opencms/opencms/en/dcc-dtab-committee",
    //     type: "type6",
    // },
    // {
    //     name: "Drugs",
    //     link: "/opencms/opencms/en/Drugs/",
    //     type: "type3",
    //     submenus: [
    //         {
    //             name: "Fixed Dose Combination",
    //             link: "/opencms/opencms/en/Drugs/FDC/",
    //             tableType: "typeA",
    //             pageType: "typeA",
    //         },
    //         {
    //             name: "Investigational New Drugs",
    //             link: "/opencms/opencms/en/Drugs/Investigational-New-Drugs-/",
    //             tableType: "typeA",
    //             pageType: "typeA",
    //         },
    //         {
    //             name: "New Drugs",
    //             link: "/opencms/opencms/en/Drugs/New-Drugs/",
    //             tableType: "typeA",
    //             pageType: "typeA",
    //         },
    //         {
    //             name: "Subsequent New Drugs",
    //             link: "/opencms/opencms/en/Drugs/Subsequent-New-Drugs/",
    //             tableType: "typeA",
    //             pageType: "typeA",
    //         },
    //     ],
    // },
    // {
    //     name: "International Cell",
    //     link: "/opencms/opencms/en/international/",
    //     type: "type4",
    //     tableType: "typeF",
    // },
    // {
    //     name: "Medical Devices & Diagnostics",
    //     link: "/opencms/opencms/en/Medical-Device-Diagnostics/",
    //     type: "type3",
    //     submenus: [
    //         {
    //             name: "InVitro Diagnostics",
    //             link: "/opencms/opencms/en/Medical-Device-Diagnostics/InVitro-Diagnostics/",
    //             tableType: "typeA",
    //             pageType: "typeA",
    //         },
    //         {
    //             name: "Medical Device",
    //             link: "/opencms/opencms/en/Medical-Device-Diagnostics/Medical-Device-Diagnostics/",
    //             tableType: "typeA",
    //             pageType: "typeA",
    //         },
    //     ],
    // },
    // {
    //     name: "Notifications",
    //     link: "/opencms/opencms/en/Notifications/",type:"type2",
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
    // {
    //     name: "Committees",
    //     link: "/opencms/opencms/en/Committees/",type:"type2",
    //     submenus: [
    //         {
    //             name: "ASR Committee",
    //             link: "/opencms/opencms/en/Committees/ASR-Committee/",
    //             pageType: "table1",
    //             tableType: "typeA",
    //         },
    //         {
    //             name: "Apex Committee",
    //             link: "/opencms/opencms/en/Committees/Apex-Committee/",
    //             pageType: "table1",
    //             tableType: "typeA",
    //         },
    //         {
    //             name: "DCC",
    //             link: "/opencms/opencms/en/Committees/DCC/",
    //             pageType: "table1",
    //             tableType: "typeA",
    //         },
    //         {
    //             name: "DTAB",
    //             link: "/opencms/opencms/en/Committees/DTAB/",
    //             pageType: "table1",
    //             tableType: "typeA",
    //         },
    //         {
    //             name: "IND",
    //             link: "/opencms/opencms/en/Committees/IND/",
    //             pageType: "table1",
    //             tableType: "typeA",
    //         },
    //         {
    //             name: "Miscellaneous",
    //             link: "/opencms/opencms/en/Committees/Miscellaneous/",
    //             pageType: "table1",
    //             tableType: "typeA",
    //         },
    //         {
    //             name: "NDAC",
    //             link: "/opencms/opencms/en/Committees/NDAC/",
    //             pageType: "table1",
    //             tableType: "typeA",
    //         },
    //         {
    //             name: "SEC",
    //             link: "/opencms/opencms/en/Committees/SEC/",
    //             pageType: "table1",
    //             tableType: "typeE",
    //         },
    //         {
    //             name: "Technical Committee",
    //             link: "/opencms/opencms/en/Committees/Technical-Committee/",
    //             pageType: "table1",
    //             tableType: "typeA",
    //         },
    //     ],
    // },
    // {
    //     name: "PRO",
    //     link: "/opencms/opencms/en/PRO/",
    //     type: "type6",
    // },
    {
        name: "PSUR/PV/AEFI",
        link: "/opencms/opencms/en/PSUR_PV_AEFI/",
        type: "type5",
    },
    // {
    //     name: "Clinical Trial <--> Ethics Committee <--> Re-Registered Ethics Committees",
    //     link: "/opencms/opencms/en/Clinical-Trial/Ethics-Committee/Ethics-Committee-Re-Registration/",
    //     type: "type4",
    //     tableType: "typeF",
    // },
    // {
    //     name: "Clinical Trial <--> Ethics Committee <--> Registered Ethics Committees",
    //     link: "/opencms/opencms/en/Clinical-Trial/Ethics-Committee/Ethics-Committee-Registration/",
    //     type: "type4",
    //     tableType: "typeF",
    // },
    // {
    //     name: "Clinical Trial <--> Serious Adverse Event",
    //     link: "/opencms/opencms/en/Clinical-Trial/SAE/",
    //     type: "type7",
    // },
    // {
    //     name: "About Us <--> Seniority List",
    //     link: "/opencms/opencms/en/About-us/Seniority-List/",
    //     type: "type4",
    //     tableType: "typeA",
    // },
];

module.exports = menuItems;
