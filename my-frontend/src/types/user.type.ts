type User = {
	id: string;
	username: string;
	companies: {
		id: string;
		name: string;
	}[];
};

type PaginationMeta = {
	page: number;
	pageSize: number;
	totalOfPage: number;
};

type UsersResponse = {
	Users: {
		data: User[];
		meta: {
			pagination: PaginationMeta;
		};
	};
};
