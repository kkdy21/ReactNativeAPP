import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

const { height, width: SCREEN_WIDTH } = Dimensions.get('window');

const API_KEY = '784ab24ff2ed5d94d4288abed9e25d13';

const icons = {
  Clouds: 'cloud',
  Snow: 'cloud-snow',
  Clear: 'sun',
  Atmosphere: 'cloud-lightning',
  Rain: 'cloud-rain',
  Drizzle: 'cloud-drizzle',
  Thunderstorm: 'cloud-lightning',
}

export default function App() {

  const [city, setCity] = useState('...Loading');
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    
    //권한 여부
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
      return;
    }

    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    
    //현재의 latitude, longitude를 반환
    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
    setCity(location[0].city);

    let getUrl = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    let response = await fetch(getUrl);
    let json = await response.json();
    setDays(json.list);
  }

  useEffect(() => {
    getWeather();
  },[])

  return (
    <View style={styles.mainContainer}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        contentContainerStyle={styles.weather}
        >
        {days.length === 0 ?
          <View style={styles.day}><ActivityIndicator color='white' size='large' style={{ marginTop: 10 }} /></View> :
          days.map((days, idx) => <View key={idx} style={styles.day}>
            <Text style={styles.date}>{new Date(days.dt * 1000).toString().substring(0, 10)}</Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              width: '100%',
            }}>
              <Text style={styles.temperature}>{parseFloat(days.temp.day).toFixed(1)}</Text>
              <Feather style={{ marginTop: 50 }} name={icons[days.weather[0].main]} size={100} color="black" />
            </View>
            <Text style={styles.description}>{days.weather[0].main}</Text>
            <Text style={{ fontSize: 20, }}>{days.weather[0].description}</Text>
          </View>)
        }
      </ScrollView>
    </View>
  );
}

///자동완성 기능
const styles = StyleSheet.create({
  mainContainer : {
    flex: 1,
    backgroundColor: 'tomato',
  },

  city: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cityName: {
    fontSize: 58,
    fontWeight: '500',
  },

  weather: {
  },

  day: {
    width: SCREEN_WIDTH,
    alignItems: 'center',

  },

  temperature: {
    marginTop: 50,
    fontSize: 120,
    fontWeight: '600',
  },
  
  description: {
    marginTop:-30,
    fontSize: 60,
  },

  date: {
    fontSize: 40,
  }


})