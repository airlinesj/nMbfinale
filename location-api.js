// Zimbabwe Location API Service
class ZimbabweLocationAPI {
    constructor() {
        this.zimbabweCities = [
            'Harare', 'Bulawayo', 'Chitungwiza', 'Mutare', 'Gweru',
            'Epworth', 'Kwekwe', 'Kadoma', 'Masvingo', 'Chinhoyi',
            'Marondera', 'Norton', 'Chegutu', 'Bindura', 'Zvishavane',
            'Victoria Falls', 'Hwange', 'Redcliff', 'Rusape', 'Chiredzi',
            'Beitbridge', 'Kariba', 'Karoi', 'Gokwe', 'Shurugwi'
        ];
        
        this.zimbabweProvinces = [
            'Harare', 'Bulawayo', 'Manicaland', 'Mashonaland Central',
            'Mashonaland East', 'Mashonaland West', 'Masvingo',
            'Matabeleland North', 'Matabeleland South', 'Midlands'
        ];
        
        this.init();
    }

    init() {
        console.log('Zimbabwe Location API initialized');
    }

    // Simulate IP-based geolocation for Zimbabwe
    async getLocationFromIP() {
        try {
            // In a real implementation, this would call an actual IP geolocation API
            // For simulation, we'll return a random Zimbabwe location
            return this.getRandomZimbabweLocation();
        } catch (error) {
            console.error('Geolocation error:', error);
            return this.getFallbackLocation();
        }
    }

    // Get random Zimbabwe location for simulation
    getRandomZimbabweLocation() {
        const city = this.zimbabweCities[Math.floor(Math.random() * this.zimbabweCities.length)];
        const province = this.getProvinceForCity(city);
        
        return {
            city: city,
            province: province,
            country: 'Zimbabwe',
            countryCode: 'ZW',
            coordinates: this.getCoordinatesForCity(city),
            timestamp: new Date().toISOString(),
            source: 'simulated'
        };
    }

    // Get province for a given city
    getProvinceForCity(city) {
        const provinceMap = {
            'Harare': 'Harare',
            'Bulawayo': 'Bulawayo',
            'Chitungwiza': 'Harare',
            'Mutare': 'Manicaland',
            'Gweru': 'Midlands',
            'Epworth': 'Harare',
            'Kwekwe': 'Midlands',
            'Kadoma': 'Mashonaland West',
            'Masvingo': 'Masvingo',
            'Chinhoyi': 'Mashonaland West',
            'Marondera': 'Mashonaland East',
            'Norton': 'Mashonaland West',
            'Chegutu': 'Mashonaland West',
            'Bindura': 'Mashonaland Central',
            'Zvishavane': 'Midlands',
            'Victoria Falls': 'Matabeleland North',
            'Hwange': 'Matabeleland North',
            'Redcliff': 'Midlands',
            'Rusape': 'Manicaland',
            'Chiredzi': 'Masvingo',
            'Beitbridge': 'Matabeleland South',
            'Kariba': 'Mashonaland West',
            'Karoi': 'Mashonaland West',
            'Gokwe': 'Midlands',
            'Shurugwi': 'Midlands'
        };
        
        return provinceMap[city] || 'Unknown';
    }

    // Get approximate coordinates for major Zimbabwe cities
    getCoordinatesForCity(city) {
        const coordinates = {
            'Harare': { lat: -17.82922, lng: 31.05396 },
            'Bulawayo': { lat: -20.15, lng: 28.58333 },
            'Chitungwiza': { lat: -18.01274, lng: 31.07555 },
            'Mutare': { lat: -18.9707, lng: 32.67086 },
            'Gweru': { lat: -19.45, lng: 29.81667 },
            'Epworth': { lat: -17.89, lng: 31.1475 },
            'Kwekwe': { lat: -18.92809, lng: 29.81486 },
            'Kadoma': { lat: -18.33328, lng: 29.91534 },
            'Masvingo': { lat: -20.06373, lng: 30.82766 },
            'Chinhoyi': { lat: -17.36667, lng: 30.2 },
            'Marondera': { lat: -18.18527, lng: 31.55193 },
            'Norton': { lat: -17.88333, lng: 30.7 },
            'Chegutu': { lat: -18.13021, lng: 30.14074 },
            'Bindura': { lat: -17.30192, lng: 31.33056 },
            'Zvishavane': { lat: -20.32674, lng: 30.06648 },
            'Victoria Falls': { lat: -17.93285, lng: 25.83066 },
            'Hwange': { lat: -18.36446, lng: 26.49877 },
            'Redcliff': { lat: -19.03333, lng: 29.78333 },
            'Rusape': { lat: -18.52785, lng: 32.12843 },
            'Chiredzi': { lat: -21.05, lng: 31.66667 },
            'Beitbridge': { lat: -22.21667, lng: 30 },
            'Kariba': { lat: -16.51667, lng: 28.8 },
            'Karoi': { lat: -16.80993, lng: 29.69247 },
            'Gokwe': { lat: -18.20476, lng: 28.9349 },
            'Shurugwi': { lat: -19.67016, lng: 30.00589 }
        };
        
        return coordinates[city] || { lat: -19.0154, lng: 29.1549 }; // Default to Zimbabwe center
    }

    // Fallback location if geolocation fails
    getFallbackLocation() {
        return {
            city: 'Harare',
            province: 'Harare',
            country: 'Zimbabwe',
            countryCode: 'ZW',
            coordinates: { lat: -17.82922, lng: 31.05396 },
            timestamp: new Date().toISOString(),
            source: 'fallback'
        };
    }

    // Validate if location is within Zimbabwe
    isLocationInZimbabwe(location) {
        if (!location || !location.countryCode) return false;
        return location.countryCode === 'ZW' || location.country === 'Zimbabwe';
    }

    // Format location for display
    formatLocation(location) {
        if (!location) return 'Unknown location';
        
        if (this.isLocationInZimbabwe(location)) {
            return `${location.city}, ${location.province}, Zimbabwe`;
        }
        
        return `${location.city}, ${location.country}`;
    }

    // Get location statistics for analytics
    getLocationStatistics(locations) {
        const stats = {
            total: locations.length,
            byCity: {},
            byProvince: {},
            uniqueCities: new Set(),
            uniqueProvinces: new Set()
        };

        locations.forEach(location => {
            if (location.city) {
                stats.byCity[location.city] = (stats.byCity[location.city] || 0) + 1;
                stats.uniqueCities.add(location.city);
            }
            
            if (location.province) {
                stats.byProvince[location.province] = (stats.byProvince[location.province] || 0) + 1;
                stats.uniqueProvinces.add(location.province);
            }
        });

        return stats;
    }

    // Get all Zimbabwe cities
    getAllZimbabweCities() {
        return [...this.zimbabweCities];
    }

    // Get all Zimbabwe provinces
    getAllZimbabweProvinces() {
        return [...this.zimbabweProvinces];
    }
}

// Initialize and export the location API
const zimbabweLocationAPI = new ZimbabweLocationAPI();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ZimbabweLocationAPI;
}
