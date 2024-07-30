"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { db } from "@/config/firebase";
import { formSchema } from "@/lib/formSchema";
import { addDoc, collection } from "firebase/firestore";

// Updated form schema


type FormData = z.infer<typeof formSchema>;

const CreateChannelPage: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [members, setMembers] = useState<string[]>([]);
    const [newMember, setNewMember] = useState("");

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            channelName: "",
            description: "",
        },
    });

    const addMember = () => {
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
            const channelRef = await addDoc(collection(db, "Channels"), {
                name: values.channelName,
                description: values.description,
                members: members,
                tasks: [],
                createdAt: new Date(),
            });

            console.log("Channel created successfully", channelRef.id);
            form.reset();
            setMembers([]);
            alert("Channel created successfully!");
        } catch (error) {
            console.error("Error creating channel:", error);
            if (error instanceof Error) {
                console.error("Error message:", error.message);
            }
            alert("Failed to create channel. Please try again.");
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
                                    <FormDescription>Enter the name of the channel.</FormDescription>
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
                                    <FormDescription>Enter a description for the channel.</FormDescription>
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