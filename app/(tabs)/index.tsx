import {
   StyleSheet,
  TouchableHighlight,
  ActivityIndicator,
} from "react-native";

import { Text, View } from "../../components/Themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { weatherConditions } from "../../Util/WeatherConditions";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const API_KEY = "6e36007bc6c9a1087677515b1d201202";

export default function WeatherScreen() {
  const params = useLocalSearchParams();

  const { name, lat, long } = params;
  const [weatherData, setWeather] = useState<any>(null);
  const router = useRouter();
  const [loader, setLoader] = useState<any>(true);
  const loadForcast = async () => {
    if (Object.keys(params).length === 0) return;
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&APPID=${API_KEY}&units=metric`
    );
    const data = await response.json();
    setWeather(data);
  };

  useEffect(() => {
    loadForcast();
  }, [name]);

  if (Object.keys(params).length === 0)
    return (
      <View style={styles.container}>
        <ActivityIndicator
          animating={loader}
          color="#bc2b78"
          size="large"
          style={styles.activityIndicator}
        />
      </View>
    );
  else
    return (
      <>
        {weatherData &&
          weatherData.weather &&
          weatherData.weather.length !== 0 && (
            <View
              style={[
                styles.weatherContainer,
                {
                  backgroundColor:
                    weatherConditions[weatherData.weather[0].main].color,
                },
              ]}
            >
              <Text style={styles.cityName}>{name + "   "}</Text>

              <View
                style={[
                  styles.headerContainer,
                  {
                    backgroundColor:
                      weatherConditions[weatherData.weather[0].main].color,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  size={120}
                  name={weatherConditions[weatherData.weather[0].main].icon}
                  color={"#fff"}
                />
                <Text style={styles.tempText}> {weatherData.main.temp}˚c</Text>
              </View>
              <View
                style={[
                  styles.windContainer,
                  {
                    backgroundColor:
                      weatherConditions[weatherData.weather[0].main].color,
                  },
                ]}
              >
                <Text style={styles.windText}>
                  Wind Flow : {weatherData.wind.speed} km/h
                </Text>
                <Text style={styles.windText}>
                  Humidity : {weatherData.main.humidity} %
                </Text>
                <Text style={styles.windText}>
                  Visiblity : {weatherData.visibility / 1000} KM
                </Text>
              </View>

              <View
                style={[
                  styles.bodyContainer,
                  {
                    backgroundColor:
                      weatherConditions[weatherData.weather[0].main].color,
                  },
                ]}
              >
                <Text style={styles.title}>
                  {weatherConditions[weatherData.weather[0].main].title}
                </Text>
                <Text style={styles.subtitle}>
                  {weatherConditions[weatherData.weather[0].main].subtitle}
                </Text>
                <View
                  style={[
                    styles.imageForcast,
                    {
                      backgroundColor:
                        weatherConditions[weatherData.weather[0].main].color,
                    },
                  ]}
                >
                  <TouchableHighlight
                    onPress={() =>
                      router.replace({
                        pathname: "/(tabs)/forcast",
                        params: params,
                      })
                    }
                  >
                    <MaterialCommunityIcons
                      size={80}
                      name={weatherConditions[weatherData.weather[0].main].wind}
                      color={"skyblue"}
                    />
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          )}
      </>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  weatherContainer: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: 30,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  tempText: {
    fontSize: 30,
    color: "#fff",
  },
  bodyContainer: {
    flex: 2,
    alignItems: "flex-start",
    justifyContent: "flex-end",
    paddingLeft: 25,
    marginBottom: 40,
  },
  title: {
    fontSize: 60,
    color: "blue",
  },
  subtitle: {
    fontSize: 24,
    color: "red",
  },
  cityName: {
    fontSize: 40,
    marginLeft: 150,
    marginTop: 10,
    color: "white",
  },
  imageForcast: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginLeft: 260,
    color: "white",
    width: 100,
  },
  windTitle: {
    fontSize: 20,
    color: "white",
  },
  windContainer: {
    flexDirection: "column",
    flex: 0,
    justifyContent: "flex-end",
    paddingLeft: 210,
    marginBottom: 40,
  },
  windText: {
    fontSize: 16,
    color: "#fff",
  },
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },
});
