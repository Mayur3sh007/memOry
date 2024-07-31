"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { db, storage } from "@/config/firebase";
import { formSchema } from "@/lib/formSchema";
import { addDoc, collection } from "firebase/firestore";
import { useUser } from "@/providers/UserContext";
import { toast } from "react-toastify";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof formSchema>;

const CreateChannelPage: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [members, setMembers] = useState<string[]>([]);
    const [newMember, setNewMember] = useState("");
    const { email } = useUser();
    const [avatar, setAvatar] = useState<File | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const router = useRouter();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            channelName: "",
            description: "",
            channelIcon: "",
        },
    });

    const addAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAvatar(e.target.files[0]);
        }
    };

    const addMember = () => {
        if (newMember === email) {
            toast.error("You cannot add yourself as a member");
            return;
        }
        if (newMember && !members.includes(newMember)) {
            setMembers([...members, newMember]);
            setNewMember("");
        }
    };

    const removeMember = (memberToRemove: string) => {
        setMembers(members.filter(member => member !== memberToRemove));
    };
   
    const onSubmit: SubmitHandler<FormData> = async (values) => {
        setIsSubmitting(true);
        try {
            let avatarURL = null;
            if (avatar) {
                const avatarRef = ref(storage, `channelIcons/${values.channelName} Channel Icon`);
                const snapshot = await uploadBytes(avatarRef, avatar);
                avatarURL = await getDownloadURL(snapshot.ref);
            }
            const channelRef = await addDoc(collection(db, "Channels"), {
                name: values.channelName,
                channelIcon: avatarURL,
                description: values.description,
                members: members,
                tasks: [],
                createdAt: new Date(),
            });

            form.reset();
            setAvatar(null);
            if(fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            setMembers([]);
            toast.success("Channel created successfully!");
            router.push("/my-gym");

        } catch (error) {
            console.error("Error creating channel:", error);
            if (error instanceof Error) {
                console.error("Error message:", error.message);
            }
            toast.error("Failed to create channel. Please try again");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen mx-12">
            <div className="w-full max-w-md p-8 space-y-8 bg-blue-800 rounded-lg shadow-md">

                <h2 className="text-2xl font-bold text-center mb-6">Create New Channel</h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="channelName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Channel Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter channel name" {...field} className="w-full" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter channel description" {...field} className="w-full" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="channelIcon"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Channel Icon</FormLabel>
                                    <FormControl>
                                        <input type="file" accept="image/*" ref={fileInputRef} onChange={addAvatar} className="w-full" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div>
                            <FormLabel>Add Members</FormLabel>
                            <div className="flex space-x-2">
                                <Input
                                    placeholder="Enter member email"
                                    value={newMember}
                                    onChange={(e) => setNewMember(e.target.value)}
                                    className="w-full"
                                />
                                <Button type="button" onClick={addMember}>Add</Button>
                            </div>
                        </div>

                        {members.length > 0 && (
                            <div>
                                <FormLabel>Members:</FormLabel>
                                <ul className="list-disc pl-5">
                                    {members.map((member, index) => (
                                        <li key={index} className="flex justify-between items-center">
                                            {member}
                                            <Button type="button" onClick={() => removeMember(member)} size="sm">Remove</Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Channel'}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default CreateChannelPage;