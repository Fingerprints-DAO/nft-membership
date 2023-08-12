import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'
import streamBuffers from 'stream-buffers'

const { PINATA_KEY, PINATA_SECRET } = process.env

type Metadata = {
  name: string
  image: string
  collection_name: string
  description: string
  artist: string
  website: string
  aspect_ratio: number
  animation_url: string
  external_url: string
  background_color: string
}

if (!PINATA_KEY || !PINATA_SECRET) {
  throw new Error('PINATA credentials not found')
}

const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS'

const maxSupply = 2000

const main = async () => {
  console.log('💡 Uploading all metadata to IPFS')
  const hashDirectory = await uploadAllItemsToIPFSFolder()
  const IPFSDirectory = `ipfs://${hashDirectory}/`
  console.log(
    `✅ Metadata has been uploaded to IPFS, folder hash is ${IPFSDirectory}`,
  )
}

const generateMetadata = async () => {
  const data = new FormData()
  const nfts = fs.readdirSync('./scripts/nft')
  for (const nft of nfts) {
    const file = fs.readFileSync(`./scripts/nft/${nft}`)
    const stream = createStreamFromBuffer(file)
    data.append('file', stream, {
      filepath: `./nft/${nft}`,
    })
  }
  const ipfsHashItemFolder = await uploadDirectoryToIPFS(data)
  const metadata: Metadata[] = []
  for (let i = 0; i < maxSupply; i++) {
    metadata.push({
      name: `Voxelglyph #${i + 1}`,
      image: addIPFSPrefix(`${ipfsHashItemFolder}/nft.jpg`),
      collection_name: 'Voxelglyph',
      description:
        "The Voxelglyph is the result of a direct partnership between Larva Labs and Fingerprints, and represents membership to Fingerprints DAO, granting access to all member perks and exposure to its renowned collection. \n\nIt is an extension of Autoglyph #134, one of the 26 Autoglyphs in the Fingerprints Collection. It consists of a script in Java stored entirely on-chain that, when executed, will take Autoglyph #134's characters as input and generate coordinates for the 3D artwork. \n\nMore information about Fingerprints DAO membership is available at https://fingerprintsdao.xyz/join.",
      artist: 'Larva Labs',
      website: 'https://fingerprintsdao.xyz/',
      aspect_ratio: 1,
      animation_url: addIPFSPrefix(`${ipfsHashItemFolder}/voxelglyph.html`),
      external_url: addIPFSPrefix(`${ipfsHashItemFolder}/voxelglyph.html`),
      background_color: '000000',
    })
  }
  return metadata
}

const uploadAllItemsToIPFSFolder = async () => {
  const data = new FormData()
  const metadata = await generateMetadata()
  metadata.forEach((itemMetadataInfo, i) => {
    const stream = createStreamFromBuffer(JSON.stringify(itemMetadataInfo))
    data.append('file', stream, {
      filepath: `./metadata/${i + 1}`,
    })
  })
  return uploadDirectoryToIPFS(data)
}

const createStreamFromBuffer = (buffer: any) => {
  const readableStreamBuffer = new streamBuffers.ReadableStreamBuffer({
    frequency: 10,
    chunkSize: 2048,
  })
  readableStreamBuffer.put(buffer)
  readableStreamBuffer.stop()
  return readableStreamBuffer
}

const uploadDirectoryToIPFS = async (formData: FormData) => {
  const { data } = await axios.post(url, formData, {
    maxContentLength: Infinity,
    headers: {
      'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
      pinata_api_key: PINATA_KEY,
      pinata_secret_api_key: PINATA_SECRET,
    },
  })

  return data.IpfsHash
}

const addIPFSPrefix = (hash: string) => `ipfs://${hash}`

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
