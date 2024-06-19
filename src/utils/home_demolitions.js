// utils/home_demolitions.js

async function fetchData() {
    const url = 'https://us-east-1.aws.data.mongodb-api.com/app/home_demolitions-guyba/endpoint/demolition_data_partial';
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Fetching data failed:", error);
      return null;
    }
  }
  
  function processDataForChart(rawData) {
    const dataByDate = rawData.reduce((acc, doc) => {
      const date = new Date(doc.Dateofincident).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          incidents: 0,
          displacedPeople: 0,
          structures: 0,
          menDisplaced: 0,
          womenDisplaced: 0,
          childrenDisplaced: 0
        };
      }
      acc[date].incidents += 1;
      acc[date].displacedPeople += doc.NumberofDisplacedPeople || 0;
      acc[date].structures += doc.TotalNumberofStructures || 0;
      acc[date].menDisplaced += doc['Men Displaced'] || 0;
      acc[date].womenDisplaced += doc['Women Displaced'] || 0;
      acc[date].childrenDisplaced += doc['children Displaced'] || 0;
      return acc;
    }, {});
  
    const sortedData = Object.entries(dataByDate)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
    return sortedData;
  }
  
  function calculateTotalIncidents(data, days) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
  
    const incidentCodes = new Set();
  
    data.forEach(doc => {
      const date = new Date(doc.Dateofincident);
      if (date >= startDate && date <= endDate) {
        incidentCodes.add(doc.Code);
      }
    });
  
    return incidentCodes.size;
  }
  
  function calculateAverage(data, days) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
  
    const filteredData = data.filter(doc => {
      const date = new Date(doc.Dateofincident);
      return date >= startDate && date <= endDate;
    });
  
    let totals = {
      displacedPeople: 0,
      structures: 0,
      menDisplaced: 0,
      womenDisplaced: 0,
      childrenDisplaced: 0
    };
  
    filteredData.forEach(doc => {
      totals.displacedPeople += doc.NumberofDisplacedPeople || 0;
      totals.structures += doc.TotalNumberofStructures || 0;
      totals.menDisplaced += doc['Men Displaced'] || 0;
      totals.womenDisplaced += doc['Women Displaced'] || 0;
      totals.childrenDisplaced += doc['children Displaced'] || 0;
    });
  
    const average = {
      incidents: filteredData.length / days,
      structures: totals.structures / days,
      displacedPeople: totals.displacedPeople / days,
      menDisplaced: totals.menDisplaced / days,
      womenDisplaced: totals.womenDisplaced / days,
      childrenDisplaced: totals.childrenDisplaced / days
    };
  
    return average;
  }
  
  function getOldestDate(data) {
    const oldestDate = data
      .filter(doc => doc.Dateofincident)
      .reduce((oldest, doc) => new Date(doc.Dateofincident) < oldest ? new Date(doc.Dateofincident) : oldest, new Date());
    return oldestDate.toISOString();
  }
  
  function getNewestDate(data) {
    const newestDate = data
      .filter(doc => doc.Dateofincident)
      .reduce((newest, doc) => new Date(doc.Dateofincident) > newest ? new Date(doc.Dateofincident) : newest, new Date('1970-01-01'));
    return newestDate.toISOString();
  }
  
  function getMostRecentTimestamp(data) {
    const mostRecentTimestamp = data
      .filter(doc => doc.timestamp)
      .reduce((mostRecent, doc) => new Date(doc.timestamp) > mostRecent ? new Date(doc.timestamp) : mostRecent, new Date('1970-01-01'));
  
    const year = mostRecentTimestamp.getFullYear();
    const month = String(mostRecentTimestamp.getMonth() + 1).padStart(2, '0');
    const day = String(mostRecentTimestamp.getDate()).padStart(2, '0');
    const time = mostRecentTimestamp.toTimeString().split(' ')[0];
  
    return `${month}.${day}.${year} ${time}`;
  }
  
  function formatAverageData(averageData) {
    return {
      incidents: averageData.incidents.toFixed(2),
      structures: averageData.structures.toFixed(2),
      displacedPeople: averageData.displacedPeople.toFixed(2),
      menDisplaced: averageData.menDisplaced.toFixed(2),
      womenDisplaced: averageData.womenDisplaced.toFixed(2),
      childrenDisplaced: averageData.childrenDisplaced.toFixed(2)
    };
  }
  
  async function processDemolitionData() {
    const response = await fetchData();
  
    if (!response || response.statusCode !== 200 || typeof response.body !== 'string') {
      console.error("Unexpected response format or error occurred:", response);
      return null;
    }
  
    const rawData = JSON.parse(response.body);
  
    if (!Array.isArray(rawData)) {
      console.error("Parsed data is not an array:", rawData);
      return null;
    }
  
    const fiveDayIncidents = calculateTotalIncidents(rawData, 10);
    const thirtyDayIncidents = calculateTotalIncidents(rawData, 90);
    const fiveDayAverage = calculateAverage(rawData, 10);
    const thirtyDayAverage = calculateAverage(rawData, 90);
  
    let totals = {
      displacedPeople: 0,
      structures: 0,
      menDisplaced: 0,
      womenDisplaced: 0,
      childrenDisplaced: 0
    };
  
    rawData.forEach(doc => {
      totals.displacedPeople += doc.NumberofDisplacedPeople || 0;
      totals.structures += doc.TotalNumberofStructures || 0;
      totals.menDisplaced += doc['Men Displaced'] || 0;
      totals.womenDisplaced += doc['Women Displaced'] || 0;
      totals.childrenDisplaced += doc['children Displaced'] || 0;
    });
  
    const chartData = processDataForChart(rawData);
  
    return {
      totalIncidents: rawData.length,
      fiveDayIncidents,
      thirtyDayIncidents,
      ...totals,
      oldestDateofincident: getOldestDate(rawData),
      newestDateofincident: getNewestDate(rawData),
      mostRecentTimestamp: getMostRecentTimestamp(rawData),
      fiveDayAverage,
      thirtyDayAverage,
      chartData
    };
  }
  
  export {
    fetchData,
    processDataForChart,
    calculateTotalIncidents,
    calculateAverage,
    getOldestDate,
    getNewestDate,
    getMostRecentTimestamp,
    formatAverageData,
    processDemolitionData
  };
  