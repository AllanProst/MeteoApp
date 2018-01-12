import React from "react";
import Expo from "expo";
import {
  Text,
  View,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { Card, Button } from "react-native-elements";
import {
  StackNavigator,
  TabNavigator,
  DrawerNavigator
} from "react-navigation";
var connect = require("react-redux").connect;
var createStore = require("redux").createStore;
var Provider = require("react-redux").Provider;
import { Camera, Permissions } from "expo";
const store = createStore(counterReducer, { valeurdeco: "" });

//////// //////////////////////////CONTENUR REDDUX

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <ImageBackground
        style={{ flex: 1 }}
        source={require("./assets/mountains.jpg")}
      >
        <View style={{ justifyContent: "center", flex: 1 }}>
          <Button
            onPress={() => this.props.navigation.navigate("City")}
            raised
            /*            icon={{name: 'room', size: 32}} */
            buttonStyle={{ backgroundColor: "#3498db" }}
            textStyle={{ textAlign: "center" }}
            title={`Info City`}
          />
        </View>
      </ImageBackground>
    );
  }
}
//////////////////////////////////FIN CONTENEUR REDDUX
//////////////////////////////////CREATION DU REDUCER
function counterReducer(state = "", action) {
  if (action.type == "saveco") {
    console.log(action.coreddux);
    return { valeurdeco: action.coreddux };
  } else {
    return state;
  }
}
//////////////////////////////////FIN DU REDUCER
function mapDispatchToProps(dispatch) {
  return {
    onSaveCo: function(value) {
      dispatch({ type: "saveco", coreddux: value });
    }
  };
}

class City extends React.Component {
  constructor(props) {
    super(props);
    this.state = { co: null, so: null, no: null, ville: "londres" };
  }

  static navigationOptions = {
    tabBarLabel: "City",
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require("./assets/icon.png")}
        style={[styles.icon, { tintColor: tintColor }]}
      />
    )
  };

  componentDidMount() {
    /// on peut mettre le "this" dans une variable pour éviter le bind (uniquement dans componnentDidMount mais pas dans une fonction classique)
    var obj = this;
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${
        this.state.ville
      }&appid=c14d8ef5041006e5294cbd0645da5611`
    )
      .then(response => response.json())
      .then(function(data) {
        var lat = Math.round(data.coord.lat);
        var lon = Math.round(data.coord.lon);

        fetch(
          `http://api.openweathermap.org/pollution/v1/co/${lat},${
            lon
          }/current.json?appid=c14d8ef5041006e5294cbd0645da5611`
        )
          .then(function(response) {
            return response.json();
          })
          .then(function(datas) {
            obj.props.onSaveCo(datas.data[0].value);
            obj.setState({
              co: datas.data[0].value
            });
          });

        fetch(
          "http://api.openweathermap.org/pollution/v1/so2/" +
            lat +
            "," +
            lon +
            "/current.json?appid=c14d8ef5041006e5294cbd0645da5611"
        )
          .then(function(response) {
            return response.json();
          })
          .then(function(datas) {
            obj.setState({
              so: datas.data[0].value
            });
          });
      });
  }

  render() {
    return (
      <View style={{ marginTop: 30 }}>
        <Card
          title="Paris Air pollution"
          image={require("./assets/eiffel-tower.jpg")}
        >
          <Text>Carbon Monoxide Data (CO): {this.state.co}</Text>
          <Text style={{ marginBottom: 10 }}>
            Sulfur Dioxide Data (SO2): {this.state.so}
          </Text>
        </Card>
      </View>
    );
  }
}

var CityRedux = connect(null, mapDispatchToProps)(City);

function mapStateToProps(state) {
  return { valueCO: state.valeurdeco };
}

class Affichage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Text> {this.props.valueCO}</Text>
      </View>
    );
  }
}
var AffichageRedux = connect(mapStateToProps, null)(Affichage);

///////EXEMPLE CAMERA////////////
class CameraExample extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  takePicture = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
      console.log(photo);
    }
  };

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            ref={ref => {
              this.camera = ref;
            }}
            style={{ flex: 1 }}
            type={this.state.type}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                flexDirection: "row"
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: "flex-end",
                  alignItems: "center"
                }}
                onPress={this.takePicture.bind(this)}
              >
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: "white" }}
                >
                  SNAP
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
}
///////EXEMPLE CAMERA////////////

const RootNavigator = TabNavigator(
  {
    Home: {
      screen: App
    },
    City: {
      screen: CityRedux
    },
    Affichage: {
      screen: AffichageRedux
    },
    Camera: {
      screen: CameraExample
    }
  },
  {
    tabBarPosition: "bottom",
    animationEnabled: true,
    backgroundColor: "pink",
    tabBarOptions: {
      activeTintColor: "yellow",
      showIcon: true
    }
  }
);

const styles = StyleSheet.create({
  icon: {
    width: 150,
    height: 150
  }
});


class Main extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Provider store={store}>
        <RootNavigator />
      </Provider>
    );
  }
}
export default Main;
