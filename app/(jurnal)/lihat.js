import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";

// Components
import getFormattedDate from "../../components/getFormattedDate";
import fetchFromAsyncStorage from "../../components/fetchFromAsyncStorage";
import getJurnalData from "../../components/getJurnalData";
import getMonthName from "../../components/getMonthName";

const LihatJurnal = () => {
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
  const [isUpdate, setIsUpdate] = useState(false);
  const [date, setDate] = useState(new Date());
  const [dateShow, setDateShow] = useState(false);

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

      await getJurnalData(fetchedData.accessToken, fetchedData.nip, date)
        .then((res) => {
          setJurnal(res);
        })
        .catch((err) => {
          Alert.alert(
            "Sorry!",
            "Internal Server Error. Please contact the development team!"
          );
        });
    };

    fetchData();
    setIsUpdate(false);
  }, [isUpdate]);

  const onChangeDate = (e, selectedDate) => {
    setDate(selectedDate);
    setDateShow(false);
    setIsUpdate(true);
    return 1;
  };

  const handleDeleteConfirm = async (j_id) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    axios.defaults.headers.common["Accept"] = `application/json`;
    await axios
      .delete(`${process.env.EXPO_PUBLIC_API_URL}/api/jurnal/destroy/${j_id}`)
      .then((res) => {
        setIsUpdate(true);
      })
      .catch((err) => {
        Alert.alert(
          "Sorry!",
          "Internal Server Error. Please contact the development team!"
        );
      });
  };

  const handleDelete = async (id) => {
    Alert.alert("Opss..", "Are you sure you want to delete this journal?", [
      {
        text: "Oke",
        onPress: () => handleDeleteConfirm(id),
      },
      {
        text: "Cancel",
      },
    ]);
    return 1;
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.heading_container}>
          <Text style={styles.heading_container_text_1}>
            Jurnal - {getMonthName(date.getMonth())} {date.getFullYear()}
          </Text>
          <Text
            style={styles.heading_container_text_2}
            onPress={() => setDateShow(true)}
          >
            Edit
          </Text>
        </View>

        {jurnal.map((item, index) => {
          return (
            <View key={index} style={styles.card_container}>
              <View style={styles.card_heading}>
                <Text style={styles.card_heading_title}>Hari / Tanggal</Text>
                <Text style={styles.card_heading_text}>
                  {getFormattedDate(new Date(item.hari_tanggal))}
                </Text>
              </View>
              <View style={styles.card_heading}>
                <Text style={styles.card_heading_title}>Jam Pembelajaran</Text>
                <Text style={styles.card_heading_text}>{item.jam_ke}</Text>
              </View>
              <View style={styles.card_heading}>
                <Text style={styles.card_heading_title}>Kelas</Text>
                <Text style={styles.card_heading_text}>{item.kelas}</Text>
              </View>
              <View style={styles.card_heading}>
                <Text style={styles.card_heading_title}>Uraian Kegiatan</Text>
                <Text style={styles.card_heading_text_2}>
                  {item.uraian_kegiatan}
                </Text>
              </View>
              <View style={styles.card_heading}>
                <Text style={styles.card_heading_title}>Kehadiran</Text>
                <Text style={styles.card_heading_text_2}>{item.kehadiran}</Text>
              </View>
              <View style={styles.card_heading}>
                <Image
                  source={{
                    uri: `${process.env.EXPO_PUBLIC_API_URL}/uploads/foto_kegiatan/${item.foto_kegiatan}`,
                  }}
                  style={styles.card_image}
                />
              </View>

              <View style={styles.card_footer}>
                <TouchableOpacity
                  style={styles.button_delete}
                  onPress={() => handleDelete(item.id)}
                >
                  <Text style={styles.button_delete_text}>Hapus</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

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
    </ScrollView>
  );
};

export default LihatJurnal;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading_container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading_container_text_1: {
    fontSize: 20,
    fontWeight: "900",
    color: "#2099FF",
  },
  heading_container_text_2: {
    fontSize: 15,
    fontWeight: "500",
  },
  card_container: {
    backgroundColor: "#FFF",
    marginBottom: 10,
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    borderTopWidth: 5,
    borderTopColor: "#2099FF",
  },
  card_heading: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
  },
  card_heading_title: {
    color: "#757575",
    fontWeight: "900",
  },
  card_heading_text: {
    color: "#000",
    fontWeight: "900",
  },
  card_heading_text_2: {
    color: "#000",
    fontWeight: "900",
    maxWidth: "50%",
  },
  card_image: {
    width: "100%",
    height: 210,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  card_footer: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    padding: 5,
  },
  button_delete: {
    backgroundColor: "#DC3545",
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 10,
  },
  button_delete_text: {
    color: "#FFF",
    fontWeight: "900",
  },
  date_time_picker_view: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
});
