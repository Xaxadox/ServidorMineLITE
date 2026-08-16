const fs = require('fs');
const nbt = require('prismarine-nbt');

async function test() {
    try {
        const buffer = fs.readFileSync('F:/ServidorMineLITE/ServerFiles/world/playerdata/6054e65c-f7b0-3cae-8c74-9dddb450513c.dat');
        const { parsed, type } = await nbt.parse(buffer);
        console.log("Keys:", Object.keys(parsed.value));
        
        const val = parsed.value;
        const health = val.Health ? val.Health.value : 'N/A';
        const dim = val.Dimension ? val.Dimension.value : 'N/A';
        
        console.log(`HP: ${health}`);
        console.log(`Dim: ${dim}`);
        
        const inv = val.Inventory ? val.Inventory.value.value : [];
        console.log(`Inventory Items: ${inv.length}`);
        if (inv.length > 0) {
            console.log("First item:", JSON.stringify(inv[0]));
        }
    } catch(e) { console.error("Error:", e); }
}
test();
