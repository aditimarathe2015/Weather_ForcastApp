import { FlatList, StyleSheet, useColorScheme } from "react-native";
import { Text, View } from "../../components/Themed";
import React, { useState, useEffect } from "react";
import { TextInput } from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function CitiesScreen() {
  const [search, setSearch] = useState("");
  const [cities, setCities] = useState<any>({});
  const [city, setCity] = useState<any>(null);
  const API_KEY = "BvGGLMWeaet2tFqE7OAiKw==tG6UxN6s8a8jOpWy";
  const colorScheme = useColorScheme();
  const _color = colorScheme === "dark" ? "white" : "black";
  const router = useRouter();
  useEffect(() => {
    async function getData() {
      const _cities = JSON.parse(
        (await AsyncStorage.getItem("cities")) || "{}"
      );
      console.dir("cities:", _cities);
      setCities(_cities);
    }
    getData();
  }, []);
  const featchCity = async () => {
    console.dir(cities);
    if (cities[search]) {
      setCity(cities[search]);
      return;
    }
    const url = "https://api.api-ninjas.com/v1/city?name=" + search;
    try {
      const req = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": API_KEY,
        },
      });
      const _cities = await req.json();

      if (_cities.length > 0) {
        let city = _cities[0];
        city.name = search;
        setCity(city);
        cities[search] = city;
      }
      setCities(cities);
      await AsyncStorage.setItem("cities", JSON.stringify(cities));
    } catch (error) {
      setCity(null);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.enterCityColumnRow}>
        <View style={styles.enterCityColumn}>
          <Text>City Finder</Text>
          <TextInput
            value={search}
            placeholder="Enter City Name"
            style={[styles.enterCity, { color: _color, borderColor: _color }]}
            onChangeText={(newText) => {
              setSearch(newText);
            }}
          ></TextInput>
          <Icon
            name="search"
            style={styles.icon}
            onPress={() => {
              featchCity();
            }}
          ></Icon>
          <Text>{Object.keys(cities).length}</Text>
        </View>
      </View>
      <View style={styles.enterCityColumnRow1}>
        <FlatList
          data={Object.values(cities)}
          renderItem={(item: any) => {
            return (
              <Text
                style={styles.item}
                onPress={() => {
                  item.item.lat = item.item.latitude;
                  item.item.long = item.item.longitude;
                  router.replace({ pathname: "/(tabs)/", params: item.item });
                }}
              >
                {item.item.name}
              </Text>
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "baseline",
    justifyContent: "flex-start",
  },
  item: {
    padding: 10,
    fontSize: 20,
    height: 50,
  },
  enterCity: {
    height: 54,
    width: 350,
    borderWidth: 1,
    paddingLeft: 5,
  },
  icon: {
    color: "rgba(128,128,128,1)",
    fontSize: 40,
    marginTop: 30,
    marginLeft: 150,
  },
  enterCityColumn: {
    width: 290,
    marginBottom: 10,
  },
  enterCityColumnRow: {
    height: 134,
    flexDirection: "row",
    marginLeft: 39,
  },
  enterCityColumnRow1: {
    flexDirection: "row",
    marginLeft: 39,
    marginTop: 10,
  },
});
