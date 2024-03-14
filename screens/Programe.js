import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { onValue, ref, set } from "firebase/database";
import { database } from "../firebase";
import { useNavigation } from "@react-navigation/native";

const Programe = () => {
  const navigation = useNavigation();

  const [programs, setPrograms] = useState();
  const [data, setData] = useState(new Date());
  const [ampm, setAmpm] = useState();
  const [day, setDay] = useState();

  const getPrograme = () => {
    const programeRef = ref(database, "Programe/");
    onValue(programeRef, (snapshot) => {
      const tmpArray = [];
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();

        tmpArray.push({ id: childKey, ...childData });
      });
      const programs = tmpArray;

      setPrograms(programs);
    });
  };

  useEffect(() => {
    getPrograme();
  }, []);

  // const programsList = programs.map((program) => {
  //   program;
  // });
  const myItemSeparator = () => {
    return (
      <View
        style={{ height: 1, backgroundColor: "grey", marginHorizontal: 10 }}
      />
    );
  };

  const myListEmpty = () => {
    return (
      <View style={{ alignItems: "center" }}>
        <Text style={styles.item}>No data found</Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("AddProgram")}>
        <LinearGradient
          colors={["#004d40", "#009688"]}
          style={styles.appButtonContainer}
        >
          <Text style={styles.appButtonText}>Adauga un program</Text>
        </LinearGradient>
      </TouchableOpacity>
      <FlatList
        data={programs}
        renderItem={({ item }) => (
          <Text style={styles.item}>{JSON.stringify(item.data)}</Text>
        )}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={myItemSeparator}
        ListEmptyComponent={myListEmpty}
        ListHeaderComponent={() => (
          <Text
            style={{
              fontSize: 20,
              textAlign: "center",
              marginTop: 20,
              fontWeight: "bold",
              textDecorationLine: "underline",
            }}
          >
            Programe create
          </Text>
        )}
        ListFooterComponent={() => (
          <Text
            style={{
              fontSize: 10,
              textAlign: "center",
              marginBottom: 20,
              fontWeight: "bold",
            }}
          >
            Thank You
          </Text>
        )}
      />
    </SafeAreaView>
  );
};

export default Programe;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
    fontSize: 30,
  },
  item: {
    padding: 20,
    marginTop: 5,
    fontSize: 20,
  },
  appButtonContainer: {
    margin: 5,
    elevation: 8,
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
});
