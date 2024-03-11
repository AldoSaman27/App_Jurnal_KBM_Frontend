import DateTimePicker from "@react-native-community/datetimepicker";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
} from "react-native";

// Icon
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

// Components
import fetchFromAsyncStorage from "../../../components/fetchFromAsyncStorage";
import getFormattedDate from "../../../components/getFormattedDate";
import generatePdf from "../../../components/generatePdf";
import getJurnalData from "../../../components/getJurnalData";

const dashboard = () => {
  const [storageData, setStorageData] = useState({
    accessToken: null,
    id: null,
    name: null,
    nip: null,
    mapel: null,
    sekolah: null,
    foto: null,
    email: null,
    created_at: null,
    updated_at: null,
  });
  const [jurnal, setJurnal] = useState([]);
  const [date, setDate] = useState(new Date());
  const [dateShow, setDateShow] = useState(false);
  const [isReload, setIsReload] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [semester, setSemester] = useState("");
  const [tahunPelajaran, setTahunPelajaran] = useState("");

  const {
    accessToken,
    id,
    name,
    nip,
    mapel,
    sekolah,
    foto,
    email,
    created_at,
    updated_at,
  } = storageData;

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await fetchFromAsyncStorage();
      setStorageData(fetchedData);

      setIsLoading(true);

      await getJurnalData(fetchedData.accessToken, fetchedData.nip, date)
        .then((res) => {
          setIsLoading(false);
          setJurnal(res);
        })
        .catch((err) => {
          setIsLoading(false);

          return Alert.alert(
            "Sorry!",
            "Internal Server Error. Please contact the development team!"
          );
        });
    };

    fetchData();
    setIsReload(false);
  }, [isReload]);

  const onChangeDate = (e, selectedDate) => {
    setDate(selectedDate);
    setDateShow(false);
    setIsReload(true);
    return 1;
  };

  const onUnduhJurnal = async () => {
    setModalShow(false);
    await generatePdf(
      foto,
      name,
      nip,
      mapel,
      jurnal,
      semester,
      tahunPelajaran,
      sekolah
    );
    return 1;
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <View style={styles.user_container}>
          <Image
            source={`${process.env.EXPO_PUBLIC_API_URL}/uploads/foto/${
              foto || "User_Profile.png"
            }`}
            style={styles.user_image}
          />
          <View style={styles.user_info}>
            <Text style={styles.user_name}>{name || `User #${id}`}</Text>
            <View style={styles.user_line}></View>
            <Text style={styles.user_nip}>{nip}</Text>
          </View>
        </View>
        <View style={styles.menu_container}>
          <View style={styles.menu_item}>
            <TouchableOpacity style={styles.jurnal_button}>
              <Link style={styles.jurnal_button_text} href="/jurnal/buat">
                <FontAwesome name="plus-circle" size={30} />
              </Link>
            </TouchableOpacity>
            <Text style={styles.jurnal_text}>Buat Jurnal</Text>
          </View>
          <View style={styles.menu_item}>
            <TouchableOpacity style={styles.jurnal_button}>
              <Link style={styles.jurnal_button_text} href="/jurnal/lihat">
                <FontAwesome name="eye" size={30} />
              </Link>
            </TouchableOpacity>
            <Text style={styles.jurnal_text}>Lihat Jurnal</Text>
          </View>
          <View style={styles.menu_item}>
            <TouchableOpacity
              style={styles.jurnal_button}
              onPress={() => setModalShow(true)}
            >
              <Text style={styles.jurnal_button_text}>
                <FontAwesome name="download" size={30} />
              </Text>
            </TouchableOpacity>
            <Text style={styles.jurnal_text}>Unduh Jurnal</Text>
          </View>
        </View>

        <Modal transparent={true} visible={modalShow}>
          <View style={styles.modal_background}>
            <View style={styles.modal_container}>
              <View style={styles.modal_header}>
                <Text style={styles.modal_title}>Unduh Jurnal</Text>
                <MaterialIcons
                  name="close"
                  size={30}
                  onPress={() => setModalShow(false)}
                />
              </View>
              <View style={styles.form_group}>
                <FontAwesome
                  name="calendar"
                  style={styles.icon}
                  size={20}
                  color="#000"
                />
                <Text
                  style={styles.input_group}
                  onPress={() => setDateShow(true)}
                >
                  {getFormattedDate(date)}
                </Text>
              </View>
              <View style={styles.form_group}>
                <FontAwesome
                  name="list"
                  style={styles.icon}
                  size={20}
                  color="#000"
                />
                <TextInput
                  style={styles.input_group}
                  placeholder="Semester"
                  placeholderTextColor="#999"
                  onChangeText={(text) => setSemester(text)}
                />
              </View>
              <View style={styles.form_group}>
                <FontAwesome
                  name="list"
                  style={styles.icon}
                  size={20}
                  color="#000"
                />
                <TextInput
                  style={styles.input_group}
                  placeholder="Tahun Pelajaran"
                  placeholderTextColor="#999"
                  onChangeText={(text) => setTahunPelajaran(text)}
                />
              </View>
              <TouchableOpacity
                style={styles.jurnal_button_unduh}
                onPress={onUnduhJurnal}
                disabled={isLoading}
              >
                <Text style={styles.jurnal_button_unduh_text}>
                  Unduh Jurnal
                </Text>
              </TouchableOpacity>
            </View>

            {dateShow && (
              <View style={styles.date_time_picker_view}>
                <DateTimePicker
                  value={date}
                  mode="date"
                  is24Hour={true}
                  onChange={onChangeDate}
                />
              </View>
            )}
          </View>
        </Modal>
      </View>
    </SafeAreaProvider>
  );
};

export default dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  user_container: {
    backgroundColor: "#2099FF",
    width: "100%",
    height: 150,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 20,
  },
  user_image: {
    width: 100,
    height: 100,
    borderWidth: 5,
    borderColor: "#FFF",
    borderRadius: 100,
    marginEnd: 20,
  },
  user_info: {
    width: "60%",
  },
  user_name: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "900",
  },
  user_nip: {
    color: "#FFF",
    fontWeight: "500",
  },
  user_line: {
    width: "100%",
    height: 2.5,
    backgroundColor: "#FFF",
    marginVertical: 5,
    borderRadius: 100,
  },
  menu_container: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  menu_item: {
    width: "33.33%",
    display: "flex",
    alignItems: "center",
    // justifyContent: "center",
    paddingVertical: 10,
  },
  jurnal_button: {
    backgroundColor: "#FFF",
    width: 60,
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  jurnal_button_text: {
    color: "#2099FF",
  },
  jurnal_text: {
    color: "#000",
    fontWeight: "500",
    marginTop: 10,
  },
  date_time_picker_view: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  modal_background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal_container: {
    width: "90%",
    height: 285,
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingVertical: 15,
    paddingLeft: 20,
    paddingRight: 15,
  },
  modal_header: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  modal_title: {
    fontSize: 20,
    fontWeight: "900",
  },
  input_group: {
    backgroundColor: "#EAEAEA",
    padding: 5,
    width: "85%",
  },
  form_group: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#EAEAEA",
    padding: 5,
    borderRadius: 10,
    marginVertical: 5,
  },
  icon: {
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  jurnal_button_unduh: {
    backgroundColor: "#2099FF",
    width: "100%",
    height: 50,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  jurnal_button_unduh_text: {
    fontSize: 15,
    fontWeight: "900",
    color: "#FFF",
    width: "100%",
    textAlign: "center",
  },
});
