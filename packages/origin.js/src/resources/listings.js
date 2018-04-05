// For now, we are just wrapping the methods that are already in
// contractService and ipfsService.

class Listings {
  async allIds() {
    return await this.origin.contractService.getAllListingIds()
  }

  async getByIndex(listingIndex) {
    const contractData = await this.origin.contractService.getListing(
      listingIndex
    )
    const ipfsData = await this.origin.ipfsService.getFile(
      contractData.ipfsHash
    )
    // ipfsService should have already checked the contents match the hash,
    // and that the signature validates

    // We explicitly set these fields to white list the allowed fields.
    const listing = {
      name: ipfsData.data.name,
      category: ipfsData.data.category,
      description: ipfsData.data.description,
      location: ipfsData.data.location,
      pictures: ipfsData.data.pictures,

      address: contractData.address,
      index: contractData.index,
      ipfsHash: contractData.ipfsHash,
      sellerAddress: contractData.lister,
      price: contractData.price,
      unitsAvailable: contractData.unitsAvailable
    }

    // TODO: Validation

    return listing
  }

  async create(data, schemaType) {
    if (data.price == undefined) {
      throw "You must include a price"
    }
    if (data.name == undefined) {
      throw "You must include a name"
    }
    return this.origin.originService.submitListing(
      { formData: data },
      schemaType
    )
  }

  async buy(listingAddress, unitsToBuy, ethToPay) {
    return await this.origin.contractService.buyListing(
      listingAddress,
      unitsToBuy,
      ethToPay
    )
  }
}

module.exports = Listings
