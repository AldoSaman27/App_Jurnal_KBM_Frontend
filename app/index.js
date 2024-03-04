import Icon1 from "react-native-vector-icons/MaterialIcons";
import Icon2 from "react-native-vector-icons/FontAwesome";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Modal, Text, TouchableOpacity, View, StyleSheet } from "react-native";

// Components
import fetchFromAsyncStorage from "../components/fetchFromAsyncStorage";
import getFormattedDate from "../components/getFormattedDate";
import generatePdf from "../components/generatePdf";
import getJurnalData from "../components/getJurnalData";

const index = () => {
  const [storageData, setStorageData] = useState({
    accessToken: null,
    id: null,
    name: null,
    nip: null,
    mapel: null,
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

  const {
    accessToken,
    id,
    name,
    nip,
    mapel,
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
    await generatePdf(foto, name, nip, mapel, jurnal);
    return 1;
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Image
          source={`${process.env.EXPO_PUBLIC_API_URL}/uploads/foto/${foto}`}
          style={styles.user_image}
        />
        <Text style={styles.user_name}>{name}</Text>
        <View style={styles.heading_container}>
          <Text style={styles.heading_text}>Personal Info</Text>
          <Link style={styles.heading_text} href="/(user)/settings">
            Edit
          </Link>
        </View>
        <View style={styles.personal_infomartion}>
          <View style={styles.personal_infomartion_heading}>
            <Icon1 name="text-snippet" size={30} color={"#2099FF"} />
            <Text style={styles.personal_infomartion_heading_text}>NIP</Text>
          </View>
          <View>
            <Text style={styles.personal_infomartion_text}>{nip}</Text>
          </View>
        </View>
        <View style={styles.personal_infomartion}>
          <View style={styles.personal_infomartion_heading}>
            <Icon1 name="subject" size={30} color={"#2099FF"} />
            <Text style={styles.personal_infomartion_heading_text}>Mapel</Text>
          </View>
          <View>
            <Text style={styles.personal_infomartion_text}>{mapel}</Text>
          </View>
        </View>
        <View style={styles.personal_infomartion}>
          <View style={styles.personal_infomartion_heading}>
            <Icon1 name="email" size={30} color={"#2099FF"} />
            <Text style={styles.personal_infomartion_heading_text}>Email</Text>
          </View>
          <View>
            <Text style={styles.personal_infomartion_text}>{email}</Text>
          </View>
        </View>
        <View style={styles.heading_container}>
          <Text style={styles.heading_text}>Jurnal</Text>
        </View>
        <TouchableOpacity style={styles.jurnal_button}>
          <Link style={styles.jurnal_button_text} href="/(jurnal)/buat">
            Buat Jurnal
          </Link>
        </TouchableOpacity>
        <TouchableOpacity style={styles.jurnal_button}>
          <Link style={styles.jurnal_button_text} href="/(jurnal)/lihat">
            Lihat Jurnal
          </Link>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.jurnal_button}
          onPress={() => setModalShow(true)}
        >
          <Text style={styles.jurnal_button_text}>Unduh Jurnal</Text>
        </TouchableOpacity>

        <Modal transparent={true} visible={modalShow}>
          <View style={styles.modal_background}>
            <View style={styles.modal_container}>
              <View style={styles.modal_header}>
                <Text style={styles.modal_title}>Unduh Jurnal</Text>
                <Icon1
                  name="close"
                  size={30}
                  onPress={() => setModalShow(false)}
                />
              </View>
              <View style={styles.form_group}>
                <Icon2
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
              <TouchableOpacity
                style={styles.jurnal_button}
                onPress={onUnduhJurnal}
                disabled={isLoading}
              >
                <Text style={styles.jurnal_button_text}>Unduh Jurnal</Text>
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

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  user_image: {
    width: 150,
    height: 150,
    borderWidth: 5,
    borderColor: "#2099FF",
    borderRadius: 100,
    marginBottom: 20,
  },
  user_name: {
    fontSize: 30,
    fontWeight: "900",
  },
  heading_container: {
    width: "100%",
    maxHeight: 60,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading_text: {
    fontSize: 15,
    fontWeight: "500",
  },
  personal_infomartion: {
    backgroundColor: "#EAEAEA",
    width: "100%",
    maxHeight: 50,
    borderRadius: 10,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 10,
  },
  personal_infomartion_heading: {
    flex: 1,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  personal_infomartion_heading_text: {
    fontSize: 15,
    fontWeight: "900",
    color: "#757575",
  },
  personal_infomartion_text: {
    fontSize: 15,
    fontWeight: "900",
  },
  jurnal_button: {
    backgroundColor: "#2099FF",
    width: "100%",
    maxHeight: 50,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  jurnal_button_text: {
    fontSize: 15,
    fontWeight: "900",
    color: "#FFF",
    width: "100%",
    textAlign: "center",
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
    height: "20%",
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
    marginTop: 10,
    marginBottom: 10,
  },
  icon: {
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
});
