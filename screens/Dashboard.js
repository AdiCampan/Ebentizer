import React, { useEffect, useState, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Image,
  ImageBackground,
  Switch,
  FlatList,
  Pressable,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getAuth, signOut } from "firebase/auth";
import { database } from "../firebase";
import {
  onValue,
  update,
  set,
  child,
  ref,
  orderByChild,
  equalTo,
  query,
  startAt,
  endAt,
} from "firebase/database";
import { SimpleLineIcons } from "@expo/vector-icons";
import { StateContext } from "../context";
import { stringify, v4 as uuidv4 } from "uuid";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

const Dashboard = () => {
  const [users, setUsers, grupuri, setGrupuri, programe] =
    useContext(StateContext);
  const navigation = useNavigation();
  const auth = getAuth();
  const userId = auth.currentUser.uid;
  const userRef = ref(database, `Usuarios/${userId}`);

  // const [expoPushToken, setExpoPushToken] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState("");
  const [programedInPrograms, setProgramedInPrograms] = useState();
  const [disponibil, setDisponibil] = useState();
  const [participConfirm, setParticipConfirm] = useState(false);

  const image = require("../Components/Logotipos Finales/Símbolos/White/MedioLogo.png");

  async function sendPushNotification(expoPushToken) {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: "Mesaj de la Ebenetizer",
      body: "Saluuut!",
      data: { someData: "goes here" },
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
  console.log("user", user.token);

  const toggleDisponibil = () => {
    setDisponibil((previousState) => !previousState);
  };
  useEffect(() => {
    if (user) {
      const newData = { disponibil: disponibil };
      update(userRef, newData)
        .then(() => {})
        .catch((err) => console.error(err));
    }
  }, [disponibil]);

  useEffect(() => {
    // Función para verificar si un ID está presente en "programe" y retornar la propiedad y el valor de "particip"
    const contieneIdYPropiedad = (propiedad, subarreglo) => {
      if (Array.isArray(subarreglo)) {
        const objetoEncontrado = subarreglo.find(
          (objeto) => objeto.id === userId
        );
        if (objetoEncontrado) {
          return { propiedad, particip: objetoEncontrado.particip };
        }
      }
    };

    // Filtrar programe y guardar la información de la propiedad y el valor de "particip"
    const resultadosFiltrados = programe?.reduce((resultados, objeto) => {
      for (const [propiedad, subarreglo] of Object.entries(objeto)) {
        const infoEncontrada = contieneIdYPropiedad(propiedad, subarreglo);
        if (infoEncontrada) {
          resultados.push({
            ...objeto,
            propiedad: infoEncontrada.propiedad,
            particip: infoEncontrada.particip,
          });
        }
      }
      return resultados;
    }, []);
    setModalVisible(true);
    setProgramedInPrograms(resultadosFiltrados);
  }, [participConfirm]);

  //Obtener los datos del usuario Autentificado//

  useEffect(() => {
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      setUser(data);
      setDisponibil(data.disponibil);
    });
  }, []);

  const onLogOut = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate("LoginScreen");
        console.log("sign-out");
      })
      .catch((error) => {
        // An error happened.
      });
  };
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
  const confirm = (program, index) => {
    setParticipConfirm(true);
    const referencia = ref(
      database,
      `Programe/${program.id}/${program.propiedad}`
    );
    const updatedList = programedInPrograms[index][program.propiedad].map(
      (item) => {
        return {
          ...item,
          particip: item.id === userId ? true : item.particip,
        };
      }
    );
    set(referencia, updatedList)
      .then((data) => {
        // console.log(data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const closeProgram = () => {
    setModalVisible(!modalVisible);
  };
  return (
    <LinearGradient
      style={styles.background}
      colors={["#cc6d13", "#3b5998", "#101d3f"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <Text>Hello {user?.name}</Text>
        <SimpleLineIcons
          name="logout"
          size={24}
          color="black"
          onPress={onLogOut}
        />
        {user && (
          <View style={styles.disponibil}>
            <Text>Disponibil: </Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={user.disponibil ? "#98fb98" : "#d3d3d3"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleDisponibil}
              value={user.disponibil}
            />
          </View>
        )}

        <Text style={styles.title}>ORGANIZARE PROGRAME</Text>
        {programedInPrograms?.length > 0 && (
          <View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                // Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View style={styles.container}>
                    <FlatList
                      data={programedInPrograms}
                      renderItem={({ item, index }) => (
                        <View style={styles.item}>
                          <Text>{JSON.stringify(item.data)}</Text>
                          <Text>Slujba: {JSON.stringify(item.propiedad)}</Text>
                          {item.particip === false && (
                            <View style={styles.buttonsContainer}>
                              <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => confirm(item, index)}
                              >
                                <Text style={styles.textStyle}> PARTICIP</Text>
                              </TouchableOpacity>
                              <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={closeProgram}
                              >
                                <Text style={styles.textStyle}>
                                  {" "}
                                  NU PARTICIP
                                </Text>
                              </Pressable>
                            </View>
                          )}
                        </View>
                      )}
                      keyExtractor={(item) =>
                        `${JSON.stringify(item.data)}` +
                        `${JSON.stringify(item.propiedad)}`
                      }
                      ItemSeparatorComponent={myItemSeparator}
                      ListEmptyComponent={myListEmpty}
                      ListHeaderComponent={() => (
                        <Text
                          style={{
                            fontSize: 20,
                            textAlign: "center",
                            marginTop: 20,
                            fontWeight: "bold",
                          }}
                        >
                          Esti programat in :
                        </Text>
                      )}
                    ></FlatList>
                  </View>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={closeProgram}
                  >
                    <Text style={styles.textStyle}> Close</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </View>
        )}
        <View style={styles.butonsContainer}>
          <TouchableOpacity
            onPress={async () => {
              await sendPushNotification(user.token);
            }}
          >
            <LinearGradient
              colors={["#004d40", "#009688"]}
              style={styles.appButtonContainer}
            >
              <Text style={styles.appButtonText}>Notification</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Grupuri")}>
            <LinearGradient
              colors={["#004d40", "#009688"]}
              style={styles.appButtonContainer}
            >
              <Text style={styles.appButtonText}>Grupuri</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <LinearGradient
              colors={["#004d40", "#009688"]}
              style={styles.appButtonContainer}
            >
              <Text style={styles.appButtonText}>Programarile mele</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Programari")}>
            <LinearGradient
              colors={["#004d40", "#009688"]}
              style={styles.appButtonContainer}
            >
              <Text style={styles.appButtonText}>Programari</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Cantari")}>
            <LinearGradient
              colors={["#004d40", "#009688"]}
              style={styles.appButtonContainer}
            >
              <Text style={styles.appButtonText}>Cantari</Text>
            </LinearGradient>
          </TouchableOpacity>
          {user?.role === 3 && (
            <View>
              <TouchableOpacity onPress={() => navigation.navigate("Programe")}>
                <LinearGradient
                  colors={["#b22222", "#fa8072"]}
                  style={styles.appButtonContainer}
                >
                  <Text style={styles.appButtonText}>Programe</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("Administrar")}
              >
                <LinearGradient
                  colors={["#b22222", "#fa8072"]}
                  style={styles.appButtonContainer}
                >
                  <Text style={styles.appButtonText}>Slujitori</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ImageBackground>
    </LinearGradient>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10,
  },
  image: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    // opacity: 0.5,
  },
  disponibil: {
    marginTop: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },

  butonsContainer: {
    // backgroundColor: "red",
    height: "70%",
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    marginLeft: 10,
    // flexDirection: "column-reverse",
    justifyContent: "flex-end",
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
  item: {
    backgroundColor: "#dcdcdc",
    padding: 20,
    marginTop: 5,
    fontSize: 20,
  },
  container: {
    flex: 1,
    paddingTop: 22,
    width: "80%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    height: "90%",
    width: "90%",
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
    marginHorizontal: 5,
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
  },
});
