import React, { useState } from "react";
import axios from "axios";
import {
    Mail,
    User,
    MessageSquare,
    Send,
    Clock,
    ShieldCheck,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const API_URL = "https://expense-manager-backend-lhq1.onrender.com/api/contact";

const ContactUs = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            await axios.post(API_URL, formData);

            toast.success("Message sent successfully!");

            setFormData({
                name: "",
                email: "",
                subject: "",
                message: "",
            });

            // Wait 1.5 seconds so the user can see the toast
            setTimeout(() => {
                navigate("/");
            }, 1500);

        } catch (error) {
            console.error(error);
            toast.error("Failed to send message.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 py-6 px-4">
            <div className="max-w-3xl mx-auto">

                {/* Page Header */}
                <div className="bg-white rounded-3xl shadow-lg p-8">

                    <h1 className="text-3xl font-bold text-gray-800">
                        Contact Us
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Have a question, feature request, or found a bug?
                        We'd love to hear from you.
                    </p>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 space-y-6"
                    >

                        {/* Name */}
                        <div className="relative">
                            <User
                                size={20}
                                className="absolute left-4 top-4 text-gray-400"
                            />

                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                        </div>

                        {/* Email */}
                        <div className="relative">
                            <Mail
                                size={20}
                                className="absolute left-4 top-4 text-gray-400"
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                        </div>

                        {/* Subject */}
                        <div className="relative">
                            <MessageSquare
                                size={20}
                                className="absolute left-4 top-4 text-gray-400"
                            />

                            <input
                                type="text"
                                name="subject"
                                placeholder="Subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                        </div>

                        {/* Message */}
                        <textarea
                            rows="4"
                            name="message"
                            placeholder="Write your message..."
                            value={formData.message}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-xl p-5 resize-none focus:ring-2 focus:ring-teal-500 outline-none"
                        />

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-teal-600 hover:bg-teal-700 transition-all duration-300 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            <Send size={20} />
                            {loading ? "Sending..." : "Send Message"}
                        </button>

                    </form>

                    {/* Contact Information */}
                    <div className="mt-6 border-t pt-5">

                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            Contact Information
                        </h2>

                        <div className="grid md:grid-cols-3 gap-4">

                            <div className="bg-gray-50 rounded-2xl p-4 shadow-sm">

                                <Mail
                                    className="text-teal-600 mb-3"
                                    size={30}
                                />

                                <h3 className="font-semibold text-lg">
                                    Email
                                </h3>

                                <p className="text-gray-600 mt-2">
                                    yourgmail@gmail.com
                                </p>

                            </div>

                            <div className="bg-gray-50 rounded-2xl p-4 shadow-sm">

                                <Clock
                                    className="text-teal-600 mb-3"
                                    size={30}
                                />

                                <h3 className="font-semibold text-lg">
                                    Response Time
                                </h3>

                                <p className="text-gray-600 mt-2">
                                    Within 24 Hours
                                </p>

                            </div>

                            <div className="bg-gray-50 rounded-2xl p-4 shadow-sm">

                                <ShieldCheck
                                    className="text-teal-600 mb-3"
                                    size={30}
                                />

                                <h3 className="font-semibold text-lg">
                                    Privacy
                                </h3>

                                <p className="text-gray-600 mt-2">
                                    Your information is safe and secure.
                                </p>

                            </div>

                        </div>

                        {/* Footer */}
                        <div className="mt-10 text-center text-gray-500 text-sm">
                            Thank you for using <span className="font-semibold text-teal-600">Finance Tracker</span>.
                            Your feedback helps us improve the application.
                        </div>



                    </div>

                </div>

            </div>

        </div>

    );
};

export default ContactUs;