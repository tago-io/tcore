import { PayloadEncoderModule } from "@tago-io/tcore-sdk";
import parserLWL01 from "./parser-lwl01";
import parserLHT52 from "./parser-lht52";
import parserLHT65 from "./parser-lht65";
import parserLDS03A from "./parser-lds03a";
import parserLGT92 from "./parser-lgt92";
import parserLDDS75 from "./parser-ldds75";
import parserLSN50V2 from "./parser-lsn50v2d22";
import parserLTC2 from "./parser-ltc2";
import parserLAQ4 from "./parser-laq4";
import parserLWL02 from "./parser-lwl02";
import parserLDS02 from "./parser-lds02";
import parserLSPH01 from "./parser-lsph01";
import parserLSNPK01 from "./parser-lsnpk01";

const encoderLWL01 = new PayloadEncoderModule({
  id: "network-actility-dragino-lwl01",
  name: "Dragino LWL01",
});
const encoderLHT52 = new PayloadEncoderModule({
  id: "network-actility-dragino-lht52",
  name: "Dragino LHT52",
});
const encoderLHT65 = new PayloadEncoderModule({
  id: "network-actility-dragino-lht65",
  name: "Dragino LHT65",
});
const encoderLDS03A = new PayloadEncoderModule({
  id: "network-actility-dragino-lds03a",
  name: "Dragino LDS03A",
});
const encoderLGT92 = new PayloadEncoderModule({
  id: "network-actility-dragino-lgt92",
  name: "Dragino LGT92",
});
const encoderLDDS75 = new PayloadEncoderModule({
  id: "network-actility-dragino-ldds75",
  name: "Dragino LDDS75",
});
const encoderLSN50V2 = new PayloadEncoderModule({
  id: "network-actility-dragino-lsn50v2",
  name: "Dragino LSN50V2",
});
const encoderLTC2 = new PayloadEncoderModule({
  id: "network-actility-dragino-ltc2",
  name: "Dragino LTC2",
});
const encoderLAQ4 = new PayloadEncoderModule({
  id: "network-actility-dragino-laq4",
  name: "Dragino LAQ4",
});
const encoderLWL02 = new PayloadEncoderModule({
  id: "network-actility-dragino-lwl02",
  name: "Dragino LWL02",
});
const encoderLDS02 = new PayloadEncoderModule({
  id: "network-actility-dragino-lds02",
  name: "Dragino LDS02",
});
const encoderLSPH01 = new PayloadEncoderModule({
  id: "network-actility-dragino-lsph01",
  name: "Dragino LSPH01",
});
const encoderLSNPK01 = new PayloadEncoderModule({
  id: "network-actility-dragino-lsnpk01",
  name: "Dragino LSNPK01",
});

encoderLWL01.onCall = parserLWL01;
encoderLHT52.onCall = parserLHT52;
encoderLHT65.onCall = parserLHT65;
encoderLDS03A.onCall = parserLDS03A;
encoderLGT92.onCall = parserLGT92;
encoderLDDS75.onCall = parserLDDS75;
encoderLSN50V2.onCall = parserLSN50V2;
encoderLTC2.onCall = parserLTC2;
encoderLAQ4.onCall = parserLAQ4;
encoderLWL02.onCall = parserLWL02;
encoderLDS02.onCall = parserLDS02;
encoderLSPH01.onCall = parserLSPH01;
encoderLSNPK01.onCall = parserLSNPK01;
