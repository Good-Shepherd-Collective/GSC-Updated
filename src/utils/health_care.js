// src/utils/health_care.js

export async function fetchHealthAttackData() {
    const url = 'https://us-east-1.aws.data.mongodb-api.com/app/health_attacks-vjccpve/endpoint/attack_on_healthcare';

    try {
        console.log('Fetching data from URL:', url);

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        console.log('HTTP response status:', response.status);

        const data = await response.json();
        
        console.log('Raw data:', data);

        if (data.body) {
            const parsedData = JSON.parse(data.body);

            const requiredCategories = [
                'Date', 'Event Description', 'Reported Perpetrator', 'Reported Perpetrator Name',
                'Weapon Carried/Used', 'Location of Incident', 
                'Number of Attacks on Health Facilities Reporting Destruction',
                'Number of Attacks on Health Facilities Reporting Damaged',
                'Forceful Entry into Health Facility', 'Occupation of Health Facility',
                'Vicinity of Health Facility Affected', 'Health Transportation Destroyed',
                'Health Transportation Damaged', 'Health Transportation Stolen/Hijacked',
                'Looting/Theft/Robbery/Burglary of Health Supplies', 'Access Denied or Obstructed',
                'Health Workers Killed', 'Health Workers Injured', 'Health Workers Kidnapped',
                'Health Workers Arrested', 'Known Kidnapping or Arrest Outcome',
                'Health Workers Threatened', 'Health Workers Assaulted', 'Health Workers Sexually Assaulted',
                'Latitude', 'Longitude', 'Geo Precision' // Add these to the required categories
            ];

            const filteredData = parsedData.map(item => {
                const filteredItem = {};
                requiredCategories.forEach(category => {
                    if (item.hasOwnProperty(category)) {
                        filteredItem[category] = item[category];
                    }
                });
                return filteredItem;
            });

            console.log('Filtered data:', filteredData);

            return filteredData;
        } else {
            throw new Error('Data does not contain expected body property');
        }
    } catch (error) {
        console.error('Error fetching health attack data:', error);
        return [];
    }
}