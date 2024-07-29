import { useState, useCallback } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

export interface Group {
    id?: string;
    name: string;
    members: UserDetails[];
    admins: UserDetails[];
    owner: UserDetails;
    dockButtons?: unknown[];
    [k: string]: unknown;
}

export interface GroupRequest {
    id?: string;
    name: string;
    members: string[];
    admins: string[];
    owner: string;
    dockButtons?: unknown[];
    [k: string]: unknown;
}

export enum Roles {
    admin = "admin",
    core = "core"
}

type TUser = Partial<{
    FName: string;
    LName: string;
    _username: string;
    active: boolean;
    appRole: string;
    band: string;
    bofaCompanyNumber: string;
    bofaCostCenterGroupName: string;
    bofaDirectManager: string;
    bofaHireDate: string;
    bofaHomeState: string;
    bofaManager: string;
    bofaNID: string;
    bofaSearchCngn: string;
    disabledStatus: string;
    displayName: string;
    emailAddress: string;
    employmentStatus: string;
    faxNumber: string;
    hierarchyCode: string;
    hireDate: string;
    homeState: string;
    jobCode: string;
    mailUnit: string;
    name: string;
    objectClass: string;
    personNumber: string;
    phoneNumber: string;
    physicalDeliveryOfficeName: string;
    postalCode: string;
    profile: null;
    role: string;
    street: string;
    terminated: boolean;
    title: string;
    uid: string;
}>;

export type UserDetails = Omit<TUser, "role"> | null;
export type LoggedUserDetails =
    | ({ role: Roles | null } & Omit<TUser, "role">)
    | null;

interface UseGroups {
    get: (id?: string) => Promise<Group | Group[]>;
    create: (data: GroupRequest) => Promise<Group>;
    update: (id: string, data: GroupRequest) => Promise<Group>;
    remove: (id: string) => Promise<void>;
    loading: boolean;
    error: string | null;
}

const useGroups = (): UseGroups => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAPI = useCallback(async (url: string, options: AxiosRequestConfig) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios(url, options);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const get = useCallback(async (id?: string) => {
        const url = id ? `/api/v1/groups/${id}` : '/api/v1/groups';
        return fetchAPI(url, { method: 'GET' });
    }, [fetchAPI]);

    const create = useCallback(async (data: GroupRequest) => {
        return fetchAPI('/api/v1/groups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data,
        });
    }, [fetchAPI]);

    const update = useCallback(async (id: string, data: GroupRequest) => {
        return fetchAPI(`/api/v1/groups/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            data,
        });
    }, [fetchAPI]);

    const remove = useCallback(async (id: string) => {
        await fetchAPI(`/api/v1/groups/${id}`, {
            method: 'DELETE',
        });
    }, [fetchAPI]);

    return { get, create, update, remove, loading, error };
};

export default useGroups;
