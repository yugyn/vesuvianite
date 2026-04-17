import MediaDB from "./MediaDB";
import SellerDB from "./SellerDB";

class TrashDB {

    constructor(db) {
        this.db = db
        this.mediaDB = new MediaDB(this.db);
        this.sellerDB = new SellerDB(this.db);
    }

    getAll(element) {

        switch(element) {
            case 'image':
                return this.mediaDB.getAllDeleted();
            case 'seller':
                return this.sellerDB.getAllDeleted();
        }

        return null;

    }

    getAllCounts() {

        // Initialize
        const elements = [];
        let count = 0;

        // Seller
        count = this.sellerDB.getAllDeletedCount();
        elements.push({
            element: 'seller'
            , count: count
        });

        // Image
        count = this.mediaDB.getAllDeletedCount();
        elements.push({
            element: 'image'
            , count: count
        });

        return elements;

    }


}


export default TrashDB;