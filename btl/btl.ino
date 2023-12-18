#include "DHT.h"
#include <ESP8266WiFi.h>
#include <Ticker.h>
#include <AsyncMqttClient.h>

#define WIFI_SSID "Louis Brown"
#define WIFI_PASSWORD "11111111"

#define MQTT_HOST IPAddress(172, 20, 10, 3)
// #define MQTT_HOST IPAddress(172, 20, 10, 2)
#define MQTT_PORT 1883

#define MQTT_PUB_SENSOR "esp/sensor"
#define MQTT_SUB_BULB "esp/bulb"
#define MQTT_SUB_FAN "esp/fan"

#define DHTPIN D5
#define LIGHTPIN A0
#define LEDPIN D4
#define FANPIN D2

#define DHTTYPE DHT11  

DHT dht(DHTPIN, DHTTYPE);

float temp;
float hum;
int lightValue;

AsyncMqttClient mqttClient;
Ticker mqttReconnectTimer;

WiFiEventHandler wifiConnectHandler;
WiFiEventHandler wifiDisconnectHandler;
Ticker wifiReconnectTimer;

unsigned long previousMillis = 0;
const long interval = 4000;

void connectToWifi() {
  Serial.println("Connecting to Wi-Fi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
}

void onWifiConnect(const WiFiEventStationModeGotIP& event) {
  Serial.println("Connected to Wi-Fi.");
  connectToMqtt();
}

void onWifiDisconnect(const WiFiEventStationModeDisconnected& event) {
  Serial.println("Disconnected from Wi-Fi.");
  mqttReconnectTimer.detach(); // ensure we don't reconnect to MQTT while reconnecting to Wi-Fi
  wifiReconnectTimer.once(2, connectToWifi);
}

void connectToMqtt() {
  Serial.println("Connecting to MQTT...");
  mqttClient.connect();
}

void onMqttConnect(bool sessionPresent) {
  Serial.println("Connected to MQTT.");
  Serial.print("Session present: ");
  Serial.println(sessionPresent);

  mqttClient.subscribe(MQTT_SUB_BULB, 1);
  mqttClient.subscribe(MQTT_SUB_FAN, 1);
}

void onMqttDisconnect(AsyncMqttClientDisconnectReason reason) {
  Serial.println("Disconnected from MQTT.");
  
  if (WiFi.isConnected()) {
    mqttReconnectTimer.once(2, connectToMqtt);
  }
}

void onMqttSubscribe(uint16_t packetId, uint8_t qos) {
  Serial.println("Subscribe acknowledged.");
  Serial.print("  packetId: ");
  Serial.println(packetId);
  Serial.print("  qos: ");
  Serial.println(qos);
}

void onMqttUnsubscribe(uint16_t packetId) {
  Serial.println("Unsubscribe acknowledged.");
  Serial.print("  packetId: ");
  Serial.println(packetId);
}

void onMqttPublish(uint16_t packetId) {
  Serial.print("Publish acknowledged.");
  Serial.print("  packetId: ");
  Serial.println(packetId);
}

void onMqttMessage(char* topic, char* payload, AsyncMqttClientMessageProperties properties, size_t len, size_t index, size_t total) {
  // Handle MQTT messages
  if (strcmp(topic, MQTT_SUB_BULB) == 0) {
    if (len == 2 && payload[0] == 'O' && payload[1] == 'N') {
      digitalWrite(LEDPIN, HIGH); // Turn the LED ON
    } else if (len == 3 && payload[0] == 'O' && payload[1] == 'F' && payload[2] == 'F') {
      digitalWrite(LEDPIN, LOW); // Turn the LED OFF
    }
   } else if (strcmp(topic, MQTT_SUB_FAN) == 0) {
    if (len == 2 && payload[0] == 'O' && payload[1] == 'N') {
      digitalWrite(FANPIN, HIGH); // Turn the LED ON
    } else if (len == 3 && payload[0] == 'O' && payload[1] == 'F' && payload[2] == 'F') {
      digitalWrite(FANPIN, LOW); // Turn the LED OFF
    }
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println();

   dht.begin();
  
  wifiConnectHandler = WiFi.onStationModeGotIP(onWifiConnect);
  wifiDisconnectHandler = WiFi.onStationModeDisconnected(onWifiDisconnect);

  mqttClient.onConnect(onMqttConnect);
  mqttClient.onDisconnect(onMqttDisconnect);
  mqttClient.onSubscribe(onMqttSubscribe);
  mqttClient.onUnsubscribe(onMqttUnsubscribe);
  mqttClient.onPublish(onMqttPublish);
  mqttClient.onMessage(onMqttMessage);
  mqttClient.setServer(MQTT_HOST, MQTT_PORT);


  pinMode(LEDPIN, OUTPUT);
  pinMode(FANPIN, OUTPUT);
  
  connectToWifi();
}

void loop() {
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    temp = dht.readTemperature();
    hum = dht.readHumidity();
    lightValue = 1024 - analogRead(LIGHTPIN);

    String message = String(temp) + "," + String(hum) + "," + String(lightValue);
    uint16_t packetIdPub = mqttClient.publish(MQTT_PUB_SENSOR, 1, true, message.c_str());                            
    Serial.printf("Publishing on topic %s at QoS 1, packetId: %i \n", MQTT_PUB_SENSOR, packetIdPub);
    Serial.println(message);

  }
}