import { Alert, Pressable, Text, View, StyleSheet } from "react-native";
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";
import { useState } from "react";

function ImagePicker() {
  const [imagePicked, setImagePicked] = useState();
  const [cameraPermissionInfo, requestPermission] = useCameraPermissions();

  async function checkPermissionsHandler() {
    if (cameraPermissionInfo.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }

    if (cameraPermissionInfo.status === PermissionStatus.DENIED) {
      Alert.alert("Permission Denied", "Camera permission was denied :(");
      return false;
    }

    return true;
  }
  async function cameraLaunchingHandler() {
    const hasPermission = await checkPermissionsHandler();
    if (!hasPermission) {
      return;
    }

    const image = await launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });
    console.log(image);

    setImagePicked(image.uri);
  }

  let imgPreview = <Text>Select up to 3 images</Text>;

  if (imagePicked) {
    imgPreview = <Image source={{uri: imagePicked}} />;
  }

  return (
    <View>
      <View style={styles.img}>{imgPreview}</View>
      <Pressable onPress={cameraLaunchingHandler}>
        <Text>Open Camera</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  img: {
    height: 200,
    width: 200,
  },
});

export default ImagePicker;
