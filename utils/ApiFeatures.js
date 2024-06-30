class ApiFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filter() {
        const queryObject = { ...this.queryString };
        const exclude = [
            "page",
            "limit",
            "sort",
            "fields",
            "distance",
            "unit",
            "latlng",
        ];
        exclude.forEach((ele) => {
            delete queryObject[ele];
        });

        let queryStr = JSON.stringify(queryObject);
        queryStr = queryStr.replace(
            /\bgte|gt|lte|lt\b/g,
            (match) => `$${match}`
        );
        this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(",").join(" ");
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort("-price"); // this will by price in defending(-)
        }
        return this;
    }

    limit() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select("-__v"); // putting the - excludes the field
        }
        return this;
    }

    paginate() {
        const limit = +this.queryString.limit || 100;
        const page = +this.queryString.page || 1;
        const skip = (page - 1) * limit;
        this.query = this.query.limit(limit).skip(skip);
        return this;
    }
}
module.exports = ApiFeatures;
