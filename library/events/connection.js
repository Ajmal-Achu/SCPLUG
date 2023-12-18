/* 

 - BASE ORI FAUZIDEV
 - ORI SCRIPT BY FAUZIDEV

*/


const connectionUpdate = (update, WAConnection) => {
  const { connection } = update
  if(connection === 'close') {
    console.info(`Connection info: Reconnecting . . .`);
    WAConnection();
  } else if(connection === 'open') {
    console.warn(`Connection info: Connected . . .`);
  }; 
}

module.exports = {
  connectionUpdate
}