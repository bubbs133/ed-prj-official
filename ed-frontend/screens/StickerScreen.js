import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../constants/colors";
import GoBack from "../components/GoBack";
import { AuthContext } from "../auth/auth-context";

const API_URL = "http://127.0.0.1:8000/stickers/";
//const API_URL = "http://192.168.0.125:8000/stickers/";

function StickerCollectionScreen({ navigation }) {
  const authCtx = useContext(AuthContext);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [stickers, setStickers] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    if (!authCtx.token) {
      return;
    }
    fetchStickerData();
  }, [authCtx.token]);

  const fetchStickerData = async () => {
    try {
      setLoading(true);

      const headers = {
        "Content-Type": "application/json",
      };
      if (authCtx.token) {
        headers.Authorization = `Token ${authCtx.token}`;
      }

      const response = await fetch(API_URL, {
        headers,
      });

      const data = await response.json();

      setStickers(data.stickers || []);
      setUserPoints(data.points || 0);
    } catch (err) {
      console.log("Sticker fetch error:", err);
      alert("Unable to load stickers right now.");
    } finally {
      setLoading(false);
    }
  };

  const redeemSticker = async (stickerId) => {
    try {
      setRedeeming(true);

      const headers = {
        "Content-Type": "application/json",
      };
      if (authCtx.token) {
        headers.Authorization = `Token ${authCtx.token}`;
      }

      const response = await fetch(`${API_URL}redeem/${stickerId}/`, {
        method: "POST",
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Unable to redeem sticker");
        return;
      }

      alert(data.detail || "Sticker redeemed successfully ✨");
      setUserPoints(data.points || userPoints);
      fetchStickerData();
      setSelectedSticker(null);
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    } finally {
      setRedeeming(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading stickers...</Text>
      </SafeAreaView>
    );
  }

  const renderSticker = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.stickerCard}
        activeOpacity={0.8}
        onPress={() => setSelectedSticker(item)}
      >
        <View
          style={[
            styles.imageContainer,
            !item.unlocked && styles.lockedContainer,
          ]}
        >
          <Image
            source={{ uri: item.image }}
            style={[styles.stickerImage, !item.unlocked && styles.lockedImage]}
          />

          {!item.unlocked && (
            <View style={styles.lockOverlay}>
              <Text style={[styles.lockText, styles.globalFont]}>Locked</Text>
            </View>
          )}
        </View>

        <Text style={styles.stickerName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.contentContainer}>
        <GoBack navigation={navigation} />

        <View style={styles.pointsContainer}>
          <Image
            style={styles.sandDollar}
            source={require("../assets/icons/seastar.png")}
          />
          <Text style={styles.pointsValue}>{userPoints}</Text>
        </View>

        <Text style={[styles.heading, { fontFamily: "Afacad" }]}>
          Sticker Shop
        </Text>
        <Text style={[styles.description, styles.globalFont]}>
          Earn sand dollars and exchange them for fun stickers just for showing
          up. Every step of the journey matters!
        </Text>

        {/*<View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              {stickers.filter((s) => s.unlocked).length}
            </Text>
            <Text style={styles.statText}>Unlocked</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stickers.length}</Text>
            <Text style={styles.statText}>Total</Text>
          </View>
        </View>*/}

        <FlatList
          data={stickers}
          keyExtractor={(item) => item.id}
          renderItem={renderSticker}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      </View>

      <Modal visible={!!selectedSticker} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedSticker && (
              <>
                <Image
                  source={{ uri: selectedSticker.image }}
                  style={styles.modalImage}
                />

                <Text style={styles.modalTitle}>{selectedSticker.name}</Text>

                <Text style={styles.modalPoints}>
                  Cost: {selectedSticker.points} points
                </Text>

                {selectedSticker.unlocked ? (
                  <View style={styles.unlockedBadge}>
                    <Text style={styles.unlockedText}>You've earned it!</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.redeemButton}
                    disabled={redeeming}
                    onPress={() => redeemSticker(selectedSticker.id)}
                  >
                    <Text style={styles.redeemButtonText}>
                      {redeeming ? "Redeeming..." : "Redeem Sticker"}
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedSticker(null)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default StickerCollectionScreen;

const styles = StyleSheet.create({
  globalFont: {
    fontFamily: "Afacad",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  loadingText: {
    fontSize: 18,
    color: Colors.darkNeutral,
    fontFamily: "Afacad",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  contentContainer: {
    flex: 1,
    paddingHorizontal: "5%",
  },
  top: {
    flex: 1,
    flexDirection: "row",
  },
  heading: {
    fontSize: 23,
    fontWeight: "500",
    color: Colors.darkNeutral,
    marginTop: 5,
    marginBottom: 5,
    textAlign: "left",
    fontFamily: "Afacad",
  },
  description: {
    fontSize: 17,
    marginBottom: 15,
  },
  pointsContainer: {
    alignItems: "flex-end",
    right: 30,
    position: "absolute",
    flexDirection: "row",
    gap: 10,
    top: "1%",
    //backgroundColor: Colors.seaBlue2,
    borderRadius: 10,
    paddingHorizontal: 5
  },

  sandDollar: {
    height: 36,
    width: 36,
    tintColor: Colors.seaDarkBlue,
  },

  pointsValue: {
    fontSize: 23,
    fontWeight: "500",
    color: Colors.darkNeutral,
    fontFamily: "Afacad",
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  statBox: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },

  statNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.darkNeutral,
    fontFamily: "Afacad",
  },

  statText: {
    fontSize: 14,
    color: Colors.darkNeutral,
    fontFamily: "Afacad",
  },

  row: {
    justifyContent: "space-between",
    marginBottom: 14,
  },

  stickerCard: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 18,
    padding: 14,
    alignItems: "center",
  },

  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    marginBottom: 12,
  },

  lockedContainer: {
    backgroundColor: "#E5E5E5",
  },

  stickerImage: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },

  lockedImage: {
    opacity: 0.25,
  },

  lockOverlay: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },

  lockText: {
    fontSize: 24,
  },

  stickerName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.darkNeutral,
    textAlign: "center",
    fontFamily: "Afacad",
  },

  stickerRarity: {
    marginTop: 5,
    fontSize: 13,
    color: "#777",
    fontFamily: "Afacad",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  modalContainer: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
  },

  modalImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 18,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.darkNeutral,
    marginBottom: 8,
    fontFamily: "Afacad",
  },

  modalRarity: {
    fontSize: 15,
    color: "#888",
    marginBottom: 10,
    fontFamily: "Afacad",
  },

  modalPoints: {
    fontSize: 16,
    color: Colors.darkNeutral,
    marginBottom: 18,
    fontFamily: "Afacad",
  },

  redeemButton: {
    backgroundColor: Colors.seaBlue2,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginBottom: 12,
  },

  redeemButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.darkNeutral,
    fontFamily: "Afacad",
  },

  unlockedBadge: {
    backgroundColor: "#D7F9E9",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 12,
  },

  unlockedText: {
    color: "#2D8A5B",
    fontWeight: "600",
    fontFamily: "Afacad",
  },

  closeButton: {
    marginTop: 10,
  },

  closeButtonText: {
    fontSize: 15,
    color: Colors.darkNeutral,
    fontFamily: "Afacad",
  },
});
