import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

export const SellerNavbar = () => {

    const [profile, setProfile] = useState({});
    const Navigate = useNavigate();
    const params = useParams();

    const fatchProfile = async () => {
        const res = await api.get(`/seller/seller-profile/${params.id}`);
        console.log(res.data);
        setProfile(res.data);
    }

    useEffect(() => {
        fatchProfile();
    }, []);
    
    return (
        <div>
            <nav className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                        S
                    </div>
                    <span className="text-stone-800 font-semibold text-lg tracking-tight">SellerHub</span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="relative p-2 rounded-lg text-stone-500 hover:bg-stone-100 transition" onClick={() => Navigate(`/seller/orders/${params.id}`)}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full"></span>
                    </button>
                    <div className="flex items-center gap-2 cursor-pointer group">
                        <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-semibold">
                            { }
                        </div>
                        <span className="text-sm text-stone-600 font-medium hidden sm:block">{profile.name}</span>
                    </div>
                </div>
            </nav>
        </div>
    )
}

