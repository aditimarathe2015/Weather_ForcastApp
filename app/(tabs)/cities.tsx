import { FlatList, StyleSheet, useColorScheme } from "react-native";
import { Text, View } from "../../components/Themed";
import React, { useState, useEffect } from "react";
import { TextInput } from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { API_KEY, CityUrl } from "../../constants/env.json";

export default function CitiesScreen() {
  const [search, setSearch] = useState("");
  const [cities, setCities] = useState<any>({});
  const [city, setCity] = useState<any>(null);
  const colorScheme = useColorScheme();
  const _color = colorScheme === "dark" ? "white" : "black";
  const router = useRouter();
  useEffect(() => {
    async function getData() {
      const _cities = JSON.parse(
        (await AsyncStorage.getItem("cities")) || "{}"
      );
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
    const url = `${CityUrl} + search;`;
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
    <View style={styles.Container}>
      <Text style={styles.cityText}>City Finder</Text>
      <View style={styles.cityContainer}>
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
      </View>
      <View style={styles.listContainer}>
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
  Container: {
    flex: 1,
    alignItems: "center",
  },
  cityContainer: {
    flex: 1,
    flexDirection: "row",
  },
  listContainer: {
    flex: 8,
    justifyContent: "flex-start",
    // flexDirection:"row",
  },

  item: {
    padding: 10,
    fontSize: 20,
    height: 50,
  },
  enterCity: {
    height: 54,
    width: 250,
    borderWidth: 1,
    paddingLeft: 10,
  },
  icon: {
    color: "rgba(128,128,128,1)",
    fontSize: 40,
    marginTop: 10,
    marginLeft: 15,
  },

  cityText: {
    fontSize: 24,
    color: "#C84831",
    fontWeight: "bold",
    alignItems: "center",
    textAlign: "center",
    paddingBottom: 20,
  },
});
