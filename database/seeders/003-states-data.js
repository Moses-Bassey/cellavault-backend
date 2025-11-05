const { QueryInterface } = require('sequelize');
const { randomUUID } = require('crypto');

module.exports = {
  up: async (queryInterface) => {
    // Get all countries from the database
    const allCountries = await queryInterface.sequelize.query(
      `SELECT id, name FROM countries ORDER BY name`,
      { 
        type: queryInterface.sequelize.QueryTypes.SELECT 
      }
    );

    if (!allCountries || !Array.isArray(allCountries) || allCountries.length === 0) {
      console.log('⚠️  No countries found. Please run countries seeders first.');
      return;
    }

    // Create a map of country names to IDs
    const countryMap = {};
    allCountries.forEach(country => {
      countryMap[country.name] = country.id;
    });

    // Define states/provinces/regions for each country
    const allStatesByCountry = {
      'Nigeria': [
        'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
        'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa',
        'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger',
        'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe',
        'Zamfara', 'FCT'
      ],
      'United States': [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
        'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
        'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
        'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
        'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
        'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
        'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
        'Wisconsin', 'Wyoming', 'District of Columbia'
      ],
      'United Kingdom': [
        'England', 'Scotland', 'Wales', 'Northern Ireland'
      ],
      'Canada': [
        'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
        'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island',
        'Quebec', 'Saskatchewan', 'Yukon'
      ],
      'Germany': [
        'Baden-Württemberg', 'Bavaria', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg', 'Hesse',
        'Lower Saxony', 'Mecklenburg-Vorpommern', 'North Rhine-Westphalia', 'Rhineland-Palatinate',
        'Saarland', 'Saxony', 'Saxony-Anhalt', 'Schleswig-Holstein', 'Thuringia'
      ],
      'Australia': [
        'Australian Capital Territory', 'New South Wales', 'Northern Territory', 'Queensland',
        'South Australia', 'Tasmania', 'Victoria', 'Western Australia'
      ],
      'India': [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
        'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
        'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
        'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
        'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli',
        'Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
      ],
      'Brazil': [
        'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal', 'Espírito Santo',
        'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará', 'Paraíba',
        'Paraná', 'Pernambuco', 'Piauí', 'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul',
        'Rondônia', 'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'
      ],
      'South Africa': [
        'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga',
        'Northern Cape', 'North West', 'Western Cape'
      ],
      'China': [
        'Anhui', 'Beijing', 'Chongqing', 'Fujian', 'Gansu', 'Guangdong', 'Guangxi', 'Guizhou',
        'Hainan', 'Hebei', 'Heilongjiang', 'Henan', 'Hong Kong', 'Hubei', 'Hunan', 'Inner Mongolia',
        'Jiangsu', 'Jiangxi', 'Jilin', 'Liaoning', 'Macau', 'Ningxia', 'Qinghai', 'Shaanxi',
        'Shandong', 'Shanghai', 'Shanxi', 'Sichuan', 'Tianjin', 'Tibet', 'Xinjiang', 'Yunnan', 'Zhejiang'
      ],
      'Japan': [
        'Hokkaido', 'Aomori', 'Iwate', 'Miyagi', 'Akita', 'Yamagata', 'Fukushima', 'Ibaraki',
        'Tochigi', 'Gunma', 'Saitama', 'Chiba', 'Tokyo', 'Kanagawa', 'Niigata', 'Toyama',
        'Ishikawa', 'Fukui', 'Yamanashi', 'Nagano', 'Gifu', 'Shizuoka', 'Aichi', 'Mie',
        'Shiga', 'Kyoto', 'Osaka', 'Hyogo', 'Nara', 'Wakayama', 'Tottori', 'Shimane',
        'Okayama', 'Hiroshima', 'Yamaguchi', 'Tokushima', 'Kagawa', 'Ehime', 'Kochi',
        'Fukuoka', 'Saga', 'Nagasaki', 'Kumamoto', 'Oita', 'Miyazaki', 'Kagoshima', 'Okinawa'
      ],
      'France': [
        'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Brittany', 'Centre-Val de Loire',
        'Corsica', 'Grand Est', 'Hauts-de-France', 'Île-de-France', 'Normandy', 'Nouvelle-Aquitaine',
        'Occitanie', 'Pays de la Loire', 'Provence-Alpes-Côte d\'Azur'
      ],
      'Italy': [
        'Abruzzo', 'Basilicata', 'Calabria', 'Campania', 'Emilia-Romagna', 'Friuli-Venezia Giulia',
        'Lazio', 'Liguria', 'Lombardy', 'Marche', 'Molise', 'Piedmont', 'Puglia', 'Sardinia',
        'Sicily', 'Trentino-Alto Adige', 'Tuscany', 'Umbria', 'Valle d\'Aosta', 'Veneto'
      ],
      'Spain': [
        'Andalusia', 'Aragon', 'Asturias', 'Balearic Islands', 'Basque Country', 'Canary Islands',
        'Cantabria', 'Castile and León', 'Castile-La Mancha', 'Catalonia', 'Extremadura', 'Galicia',
        'La Rioja', 'Madrid', 'Murcia', 'Navarre', 'Valencia'
      ],
      'Russia': [
        'Adygea', 'Altai', 'Altai Krai', 'Amur', 'Arkhangelsk', 'Astrakhan', 'Bashkortostan',
        'Belgorod', 'Bryansk', 'Buryatia', 'Chechnya', 'Chelyabinsk', 'Chukotka', 'Chuvashia',
        'Crimea', 'Dagestan', 'Ingushetia', 'Irkutsk', 'Ivanovo', 'Kabardino-Balkaria', 'Kaliningrad',
        'Kalmykia', 'Kaluga', 'Kamchatka', 'Karachay-Cherkessia', 'Karelia', 'Kemerovo', 'Khabarovsk',
        'Khakassia', 'Khanty-Mansi', 'Kirov', 'Komi', 'Kostroma', 'Krasnodar', 'Krasnoyarsk',
        'Kurgan', 'Kursk', 'Leningrad', 'Lipetsk', 'Magadan', 'Mari El', 'Mordovia', 'Moscow',
        'Moscow Oblast', 'Murmansk', 'Nenets', 'Nizhny Novgorod', 'North Ossetia-Alania', 'Novgorod',
        'Novosibirsk', 'Omsk', 'Orenburg', 'Oryol', 'Penza', 'Perm', 'Primorsky', 'Pskov',
        'Rostov', 'Ryazan', 'Sakha', 'Sakhalin', 'Samara', 'Saratov', 'Smolensk', 'Stavropol',
        'Sverdlovsk', 'Tambov', 'Tatarstan', 'Tomsk', 'Tula', 'Tuva', 'Tver', 'Tyumen',
        'Udmurtia', 'Ulyanovsk', 'Vladimir', 'Volgograd', 'Vologda', 'Voronezh', 'Yamalo-Nenets',
        'Yaroslavl', 'Zabaykalsky'
      ],
      'Kenya': [
        'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa', 'Homa Bay',
        'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii',
        'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
        'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi', 'Nakuru', 'Nandi',
        'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River',
        'Tharaka-Nithi', 'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
      ],
      'Ghana': [
        'Ahafo', 'Ashanti', 'Bono', 'Bono East', 'Central', 'Eastern', 'Greater Accra',
        'North East', 'Northern', 'Oti', 'Savannah', 'Upper East', 'Upper West', 'Volta', 'Western', 'Western North'
      ],
      'Egypt': [
        'Alexandria', 'Aswan', 'Asyut', 'Beheira', 'Beni Suef', 'Cairo', 'Dakahlia', 'Damietta',
        'Faiyum', 'Gharbia', 'Giza', 'Ismailia', 'Kafr el-Sheikh', 'Luxor', 'Matruh', 'Minya',
        'Monufia', 'New Valley', 'North Sinai', 'Port Said', 'Qalyubia', 'Qena', 'Red Sea',
        'Sharqia', 'Sohag', 'South Sinai', 'Suez'
      ],
      'Morocco': [
        'Tanger-Tetouan-Al Hoceima', 'Oriental', 'Fès-Meknès', 'Rabat-Salé-Kénitra', 'Béni Mellal-Khénifra',
        'Casablanca-Settat', 'Marrakech-Safi', 'Drâa-Tafilalet', 'Souss-Massa', 'Guelmim-Oued Noun',
        'Laâyoune-Sakia El Hamra', 'Dakhla-Oued Ed-Dahab'
      ],
      'Turkey': [
        'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin',
        'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale',
        'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum',
        'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkâri', 'Hatay', 'Isparta', 'İçel',
        'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir', 'Kocaeli',
        'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş',
        'Nevşehir', 'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas',
        'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak', 'Van', 'Yozgat', 'Zonguldak',
        'Aksaray', 'Bayburt', 'Karaman', 'Kırıkkale', 'Batman', 'Şırnak', 'Bartın', 'Ardahan',
        'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
      ]
    };

    // Collect all states to insert
    const allStatesToInsert = [];
    
    for (const countryName in allStatesByCountry) {
      const countryId = countryMap[countryName];
      if (!countryId) {
        console.log(`⚠️  Country "${countryName}" not found in database, skipping states`);
        continue;
      }

      const states = allStatesByCountry[countryName];
      for (const stateName of states) {
        // Check if state already exists
        const existingState = await queryInterface.sequelize.query(
          `SELECT id FROM states WHERE countryId = ? AND name = ? LIMIT 1`,
          { 
            replacements: [countryId, stateName],
            type: queryInterface.sequelize.QueryTypes.SELECT 
          }
        );

        if (!existingState || !Array.isArray(existingState) || existingState.length === 0) {
          allStatesToInsert.push({
            id: randomUUID(),
            name: stateName,
            countryId: countryId,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    }

    // Insert all states in batches if there are any to insert
    if (allStatesToInsert.length > 0) {
      try {
        // Insert in batches to avoid issues with large inserts
        const batchSize = 50;
        let inserted = 0;
        
        for (let i = 0; i < allStatesToInsert.length; i += batchSize) {
          const batch = allStatesToInsert.slice(i, i + batchSize);
          await queryInterface.bulkInsert('states', batch);
          inserted += batch.length;
          console.log(`✅ Inserted batch: ${inserted}/${allStatesToInsert.length} states`);
        }
        
        console.log(`✅ Successfully inserted ${allStatesToInsert.length} states for all countries`);
      } catch (error) {
        console.error('❌ Error inserting states:', error);
        throw error;
      }
    } else {
      console.log('ℹ️  All states already exist, skipping insertion');
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('states', null, {});
  },
};
