/*
  ESP32-S3 #2 (副手) + MPU6050 — 纯底层 Wire 驱动版 🎸
  ─────────────────────────────────────────────────────
  与 #1 完全相同，唯一区别：蓝牙名称改为 "ESP32-mini"
  SDA: GPIO 4 / SCL: GPIO 5
*/

#include <Wire.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

// ── I2C 引脚及地址 ──
#define SDA_PIN 4
#define SCL_PIN 5
#define MPU_ADDR 0x68

// ── BLE UUID (与主手相同，网页靠名称区分) ──
#define SERVICE_UUID  "19b10000-e8f2-537e-4f6c-d104768a1214"
#define CHAR_UUID     "03504231-c554-43a4-b711-0b2945565834"

BLEServer* pServer = nullptr;
BLECharacteristic* pChar = nullptr;
bool deviceConnected = false;

class ServerCB : public BLEServerCallbacks {
  void onConnect(BLEServer*) { deviceConnected = true; Serial.println("[BLE] 已连接"); }
  void onDisconnect(BLEServer*) { 
    deviceConnected = false; 
    Serial.println("[BLE] 断开，重播..."); 
    if (pServer) pServer->startAdvertising(); 
  }
};

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n\n[SYS] ESP32-mini (副手) 启动中...");
  
  // 1. 初始化 I2C
  Wire.begin(SDA_PIN, SCL_PIN);
  Wire.setClock(400000);
  
  // 2. 强行唤醒 MPU6050
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x6B); 
  Wire.write(0);    
  byte error = Wire.endTransmission(true);

  if (error != 0) {
    Serial.printf("[ERR] MPU6050 唤醒失败，错误码: %d\n", error);
    Serial.println("[TIPS] 请检查连线，并确认 AD0 是否接地。");
    while (1) { delay(1000); Serial.print("?"); }
  }
  
  Serial.println("[OK] MPU6050 强行唤醒成功！");

  // 3. 蓝牙初始化 —— 关键区别：名称是 "ESP32-mini"
  BLEDevice::init("ESP32-mini");
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new ServerCB());
  BLEService* pService = pServer->createService(SERVICE_UUID);
  pChar = pService->createCharacteristic(CHAR_UUID, BLECharacteristic::PROPERTY_NOTIFY);
  pChar->addDescriptor(new BLE2902());
  pService->start();

  BLEAdvertising* pAdv = BLEDevice::getAdvertising();
  pAdv->addServiceUUID(SERVICE_UUID);
  pAdv->start();
  Serial.println("[OK] 蓝牙已开启，名称: ESP32-mini");
}

void loop() {
  static unsigned long lastMs = 0;
  if (millis() - lastMs < 20) return; // 50Hz
  lastMs = millis();

  // ── 底层读取 14 个字节 ──
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x3B); 
  Wire.endTransmission(false);
  Wire.requestFrom(MPU_ADDR, 14, true);

  if (Wire.available() >= 14) {
    int16_t rax = Wire.read() << 8 | Wire.read();
    int16_t ray = Wire.read() << 8 | Wire.read();
    int16_t raz = Wire.read() << 8 | Wire.read();
    int16_t rtp = Wire.read() << 8 | Wire.read();
    int16_t rgx = Wire.read() << 8 | Wire.read();
    int16_t rgy = Wire.read() << 8 | Wire.read();
    int16_t rgz = Wire.read() << 8 | Wire.read();

    float ax = rax / 16384.0 * 9.8;
    float ay = ray / 16384.0 * 9.8;
    float az = raz / 16384.0 * 9.8;
    float gx = rgx / 131.0;
    float gy = rgy / 131.0;
    float gz = rgz / 131.0;

    if (deviceConnected) {
      char buf[128];
      snprintf(buf, sizeof(buf), "{\"ax\":%.2f,\"ay\":%.2f,\"az\":%.2f,\"gx\":%.2f,\"gy\":%.2f,\"gz\":%.2f}",
               ax, ay, az, gx, gy, gz);
      pChar->setValue((uint8_t*)buf, strlen(buf));
      pChar->notify();
    }
    
    static int cnt = 0;
    if (cnt++ % 50 == 0) {
       Serial.printf("读取正常: ax=%.2f gy=%.2f\n", ax, gy);
    }
  }
}
