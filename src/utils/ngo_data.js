  // src/utils/ngo_data.js

import fetch from "@11ty/eleventy-fetch";

// Define EINs for the nonprofits
const eins = [
    "112623719",
    "131659627",
    "113466176",
    "112706563",
    "132992985",
    "810757923",
    "134092050",
    "133156445",
    "205916414",
    "311558409",
    "860693163",
    "261507828",
    "202777557",
    "611901718",
    "530217164",
    "521623781",
    "262547583",
    "131760102",
    "237254561",
    "521623781",
    "980341969",
    "311529945",
    "942607722",
    "223951652",
    "262971061",
    "300664947",
    "883923416",
    "830672596",
    "363256096",
    "381784340",
    "521844823",
    "132686230",
    "010566033",
    "230053483",
    "752892493",
    "135628475",
    "135653335",
    "223090463",
    "981361711",
    "223951652",
    "450949784",
    "455230138",
    "530179971",
    "205350994",
    "471532020",
    "521233683",
    "813125165",
    "900653286",
    "521386172",
    "830672596",
    "751680391",
    "521332702",
    "471291052",
    "272402908",
    "841233209",
    "621279378",
    "411334042",
    "770567139",
    "520214465",
    "472768324",
    "911746258",
    "510210369",
    "113195338",
    "231731998",
    "237089073",
    "461334084",
    "751717049",
    "461508029",
    "133610041",
    "412020104",
    "611712474",
    "113348050",
    "205916414",
    "133621884",
    "263402247",
    "450464545",
    "061611859",
    "362181970",
    "043622520",
    "454041360",
    "237252135",
    "202076659",
    "113483906",
    "731470933",
    "823174462",
    "201651102",
    "471164106",
    "133509867",
    "510192618",
    "260220636",
    "760669030",
    "201381912",
    "203144206",
    "223684183",
    "593806403",
    "830581033",
    "262353859",
    "454713417",
    "208021512",
    "463732857",
    "521433850",
    "364778519",
    "843917846",
    "141891915",
    "861605645",
    "260501656",
    "203661322",
    "264269918",
    "465347153",
    "812650878",
    "208494134",
    "834088310",
    "412109553",
    "463288101",
    "824338417",
    "204329740",
    "132500881",
    "134015013",
    "13-5596779",
    "273262955",
    "941156533",
    "221714130",
    "581021791",
    "952504044",
    "462233652",
    "521777737",
    "650307706",
    "811208165",
    "475178715",
    "204981268",
    "132679404",
    "510181418",
    "473798721",
    "208676286",
    "113346935",
    "823249807",
    "453022605",
    "300630338",
    "371951112",
    "300213425",
    "061652733",
    "860693163",
    "821023190",
    "852079421",
    "020671731",
    "912167159",
    "832296044",
    "810594201",
    "471262043",
    "830761924",
    "272299035",
    "831727601",
    "830789162",
    "562199473",
    "475500914",
    "813145319",
    "815343918",
    "621863566",
    "911960797",
    "521743415",
    "800031953",
    "842612770",
    "620649151",
    "831721783",
    "133607222",
    "832246650",
    "133935945",
    "852640634",
    "871084392",
    "300129917",
    "141875617",
    "472609521",
    "873413918",
    "461232589",
    "204015961",
    "270785192",
    "473833568",
    "450666188",
    "873095614",
    "822606166",
    "832001868"
];


/**
 * Fetch data for a single EIN using 11ty fetch.
 * @param {string} ein - The EIN of the nonprofit
 * @returns {Promise<object | null>}
 */
async function fetchNonprofitData(ein) {
    try {
      const jsonResponse = await fetch(
        `https://projects.propublica.org/nonprofits/api/v2/organizations/${ein}.json`,
        {
          duration: "1d", // Cache the data for 1 day
          type: "json", // Specify that we expect JSON data
        }
      );
      // console.log(`Data fetched for EIN ${ein}:`, jsonResponse);
      return jsonResponse;
    } catch (error) {
      console.error(`Error fetching data for EIN ${ein}:`, error);
      return null;
    }
  }
  
  /**
   * Fetch and process data for all EINs.
   * @returns {Promise<object[]>}
   */
  export async function getNGOTreemapData() {
    const rawData = await fetchDataForEINs(eins);
  
    // Log the raw data
    // console.log("Raw data fetched for all EINs:", rawData);
  
    // Sum revenue over the last 10 years
    const totalCombinedRevenue = rawData.reduce((sum, org) => {
      const totalRevenue = org.filings_with_data
        .slice(0, 10) // Get the last 10 years
        .reduce((total, filing) => total + filing.totrevenue, 0);
      return sum + totalRevenue;
    }, 0);
  
    const processedData = rawData.map(org => ({
      name: org.organization.name,
      ein: org.organization.ein,
      state: org.organization.state,
      filings: org.filings_with_data.slice(0, 10).map(filing => ({
        year: filing.tax_prd_yr,
        revenue: filing.totrevenue,
        expenses: filing.totfuncexpns,
        assetsEnd: filing.totassetsend,
        liabilitiesEnd: filing.totliabend
      })),
      totalRevenue: org.filings_with_data
        .slice(0, 10) // Get the last 10 years
        .reduce((total, filing) => total + filing.totrevenue, 0)
    }));
  
    // Log processed data
    // console.log("Processed NGO data:", processedData);
  
    return {
      value: totalCombinedRevenue,
      data: processedData,
    };
  }
  
  async function fetchDataForEINs(eins) {
    const data = await Promise.all(eins.map(ein => fetchNonprofitData(ein)));
    return data.filter(org => org !== null); // Filter out any null responses
  }