function isKthBitSet(byte, k) {
  return byte & (1 << k);
}

function uint32(bytes) {
  if (bytes.length !== uint32.BYTES) {
    throw new Error('uint32 must have exactly 4 bytes');
  }

  var integer = 0;
  for (var x = 0; x < bytes.length; x++) {
    integer += integer*255 + bytes[x]
  }
  return integer;
};
uint32.BYTES = 4;

function decodeFlags(flagByte) {
  var flags = new Object()

  if (isKthBitSet(flagByte, 0))
    flags.TPC_STOPPED = 1
  
  if (isKthBitSet(flagByte, 1))
    flags.TPC_STUCK = 1
  
  if (isKthBitSet(flagByte, 2))
    flags.MULTI_DEV_ISSUE = 1
  
  if (isKthBitSet(flagByte, 3))
    flags.WIFI_AP_ENABLED = 1
  
  return flags
}

/* The Things Network Payload Decoder
  Converts raw bytes to ouptut object

 * input object
 *   {
 *     "bytes": [1, 2, 3], // FRMPayload as byte array
 *     "fPort": 1 // LoRaWAN FPort
 *   }
 *  output object
 *    {
 *      "data": { ... }, // JSON object
 *      "warnings": ["warning 1", "warning 2"], // Optional warnings
 *      "errors": ["error 1", "error 2"] // Optional errors
 *    }
 *
*/
function decodeUplink(input) {

  var data = new Object()

  switch (input.fPort){
    
    case 1:
      data.count_in = uint32(input.bytes.slice(0, 4))
      data.count_out = uint32(input.bytes.slice(4, 8))
      data.flags = decodeFlags(input.bytes[8])
    break

    default:
      return {
        errors: ["unknown FPort"]
      }
  }

  return {
    data
  };
}


// Exporting for testing only, don't copy the lines below
// To Network Server Decoder
module.exports = {
  isKthBitSet,
  uint32,
  decodeUplink
};
  