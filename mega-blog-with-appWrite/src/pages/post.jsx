import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userID === userData.$id : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    console.log('✓ Post loaded:', {id: post.$id, title: post.title, hasContent: !!post.content, contentLength: post.content?.length});
                    setPost(post);
                }
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                if (post.image && post.image.trim()) {
                    appwriteService.deleteFile(post.image);
                }
                navigate("/");
            }
        });
    };

    return post ? (
        <div className="py-8">
            <Container>
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
                    {post.image && post.image.trim() && (
                        <img
                            src={appwriteService.getFilePreview(post.image)}
                            alt={post.title}
                            className="rounded-xl"
                        />
                    )}
                    {(!post.image || !post.image.trim()) && (
                        <img
                            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='18' fill='%236b7280' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E"
                            alt={post.title}
                            className="rounded-xl"
                        />
                    )}

                    {isAuthor && (
                        <div className="absolute right-6 top-6 flex gap-4">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-green-500" className="w-32 py-3 text-lg font-bold rounded-lg hover:bg-green-600 transition text-white text-center inline-block">
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor="bg-red-500" onClick={deletePost} className="w-32 py-3 text-lg font-bold rounded-lg hover:bg-red-600 transition text-white text-center">
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                <div className="w-full mb-6">
                    <h1 className="text-4xl font-bold text-center">{post.title}</h1>
                </div>
                <div className="w-full bg-gray-50 rounded-lg p-8 mb-6">
                    <div className="browser-css text-lg leading-relaxed text-gray-800">
                        {post.content ? parse(post.content) : <p>No content available</p>}
                    </div>
                </div>
            </Container>
        </div>
    ) : null;
}
