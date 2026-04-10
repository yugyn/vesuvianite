import ImageDB from "./ImageDB";
import SellerDB from "./SellerDB";

class TrashDB {

    constructor(db) {
        this.db = db
        this.imageDB = new ImageDB(this.db);
        this.sellerDB = new SellerDB(this.db);
    }

    getAll(element) {

        switch(element) {
            case 'image':
                return this.imageDB.getAllDeleted();
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
        count = this.imageDB.getAllDeletedCount();
        elements.push({
            element: 'image'
            , count: count
        });

        return elements;

    }


}


export default TrashDB;