import axios from "axios";

export interface ProvinceResponse {
    provinceID: number,
    provinceName: string,
    countryID: number,
    code: string,
}

export const fetchProvinces = async () => {
    try {
        const response = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
            headers: { 
                'Content-Type': 'application/json',
                'token': '3ba84e9f-79c0-11ef-8697-7eb46c7feb1e', 
            }
        });
            
        const formattedProvinces: ProvinceResponse[] = response.data.data.map((province: any) => ({
            provinceID: province.ProvinceID,
            provinceName: province.ProvinceName,
            countryID: province.CountryID,
            code: province.Code,
        }));

        return formattedProvinces.sort((a, b) => a.provinceID - b.provinceID);
    } catch (error) {
        console.error('Error fetching provinces:', error);
        return []; 
    }
};

export interface DistrictResponse {
    districtID: number,
    provinceID: number,
    districtName: string,
    code: string,
}

export const fetchDistricts = async (provinceID: number) => {
    try {
        const response = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/district', {
            headers: { 
                'Content-Type': 'application/json',
                'token': '3ba84e9f-79c0-11ef-8697-7eb46c7feb1e', 
            },
            params: {
                "province_id": provinceID,
            },
        });
            
        const formattedDistricts: DistrictResponse[] = response.data.data.map((district: any) => ({
            districtID: district.DistrictID,
            provinceID: district.ProvinceID,
            districtName: district.DistrictName,
            code: district.Code,
        }));

        return formattedDistricts.sort((a, b) => a.districtID - b.districtID);
    } catch (error) {
        console.error('Error fetching districts:', error);
        return []; 
    }
};

export interface WardResponse {
    wardCode: number,
    districtID: number,
    wardName: string,
}

export const fetchWards = async (districtID: number) => {
    try {
        const response = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/ward', {
            headers: { 
                'Content-Type': 'application/json',
                'token': '3ba84e9f-79c0-11ef-8697-7eb46c7feb1e', 
            },
            params: {
                "district_id": districtID,
            },
        });
            
        const formattedWards: WardResponse[] = response.data.data.map((ward: any) => ({
            wardCode: ward.WardCode,
            districtID: ward.DistrictID,
            wardName: ward.WardName,
        }));

        return formattedWards.sort((a, b) => a.wardCode - b.wardCode);
    } catch (error) {
        console.error('Error fetching wards:', error);
        return []; 
    }
};

export interface AvailableServicesResponse {
    serviceId: number,
    serviceTypeId: number,
    shortName: string,
}

export const fetchAvailableServices = async (toDistrict: number) => {
    try {
        const response = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services', {
            headers: { 
                'Content-Type': 'application/json',
                'token': '3ba84e9f-79c0-11ef-8697-7eb46c7feb1e', 
            },
            params: {
                "shop_id": 5342996,
                "from_district": 1542, //Hà đông
                "to_district": toDistrict
            },
        });
            
        const formattedAvailableServices: AvailableServicesResponse[] = response.data.data.map((availableService: any) => ({
            serviceId: availableService.service_id,
            serviceTypeId: availableService.DistrictID,
            shortName: availableService.WardName,
        }));

        return formattedAvailableServices.sort((a, b) => a.serviceId - b.serviceId);
    } catch (error) {
        console.error('Error fetching available services:', error);
        return []; 
    }
};

export interface FeeResponse {
    fee: number;
}

export const fetchFee = async (serviceId: number, toDistrict: number, toWardCode: string) => {
    try {
        const response = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee', {
            headers: { 
                'Content-Type': 'application/json',
                'token': '3ba84e9f-79c0-11ef-8697-7eb46c7feb1e', 
                'shop_id': 5342996
            },
            params: {
                "service_id": serviceId,
                "insurance_value": 100000,
                "coupon": null,
                "to_ward_code": toWardCode,
                "to_district_id": toDistrict,
                "from_district_id": 1542, //Hà đông
                "weight": 10,
                "length": 50,
                "width": 50,
                "height": 50
            },
        });

        const formattedFee: FeeResponse = {
            fee: response.data.data.total,
        };

        return formattedFee;
    } catch (error) {
        console.error('Error fetching fee:', error);
        return null; 
    }
};