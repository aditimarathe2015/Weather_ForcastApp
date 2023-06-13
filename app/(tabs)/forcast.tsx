import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {API_KEY_FORCAST,WEATHER_URL} from '../../constants/env.json'

// const API_KEY_FORCAST = "14780e82a78c04db6dba2f35a894dd45";
// const WEATHER_URL = "https://openweathermap.org";

const cleanData = (list: any[]) => {
  let dates: any[] = [];
  let Uniq: any[] = [];
  list.forEach((item) => {
    const date: string = item.dt_txt.substring(0, 10);
    if (dates.indexOf(date) === -1) {
      dates.push(date);
      Uniq.push(item);
    }
  });
  return Uniq;
};
const forcast = () => {
  const [forcast, setForcast] = useState([]);
  const params = useLocalSearchParams();
  const { name, lat, long } = params;

  const loadWeeklyForcast = async () => {
    if (Object.keys(params).length === 0) return;
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API_KEY_FORCAST}`;
    const response = await fetch(url);
    let data = await response.json();
    data = cleanData(data.list);
    setForcast(data);
  };

  useEffect(() => {
    loadWeeklyForcast();
  }, [name]);
  return (
    <SafeAreaView style={styles.container}>
      {forcast.length > 0 ? (
        <>
          <Text style={styles.subtitle}>Weekely Forcast</Text>
          <FlatList
            data={forcast}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(item: any) => {
              const weather = item.item.weather;
                return (
                <>
                  <View style={styles.headerContainer}>
                    <Image
                      style={styles.tinyLogo}
                      source={{
                        uri: `${WEATHER_URL}/img/wn/${weather[0].icon}.png`,
                      }}
                    />
                  </View>
                  <View style={styles.headerContainer}>
                    <Text style={styles.item}>
                      {new Date(item.item.dt_txt).toLocaleDateString()}{" "}
                      {weather[0].main}
                    </Text>
                    <Text>Tempratue :{item.item.main.temp / 10}˚c </Text>
                    <Text> Humidity : {item.item.main.humidity}% </Text>
                    <Text> Wind : {item.item.wind.speed} km/h </Text>
                  </View>
                </>
              );
            }}
          />
        </>
      ) : (
        <Text>Loading.....</Text>
      )}
    </SafeAreaView>
  );
};

export default forcast;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#87CEEB",
  },
  subtitle: {
    fontSize: 24,
    color: "#C84831",
    fontWeight: "bold",
    alignItems: "center",
    textAlign:"center"
  },
  item: {
    fontSize: 20,
    height: 40,
  },
  tinyLogo: {
    width: 80,
    height: 80,
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
});
