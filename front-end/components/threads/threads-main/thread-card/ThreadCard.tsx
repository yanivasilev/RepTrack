import { View, Text, Pressable, } from "react-native";
import { ThreadType } from "../../../../libs/types/threads/ThreadType";
import Avatar from "../../../profiles/Avatar";
import { formatDateToTimeAgo } from "../../../../libs/helpers/time/formatDateToTimeAgo";
import LikeButton from "../../LikeButton";
import { useEffect, useState } from "react";
import { unlikeThreadApi } from "../../../../services/api/threads/unlikeThreadApi";
import { likeThreadApi } from "../../../../services/api/threads/likeThreadApi";
import ReplyButton from "../../ReplyButton";
import { styles } from "./styles";

type ThreadCardProps = {
    thread: ThreadType;
    onPress: () => void;
    onAuthorPress: (userId: number) => void;
};

export default function ThreadCard({ thread, onPress, onAuthorPress }: ThreadCardProps) {
    const [liked, setLiked] = useState(thread.likedByMe);
    const [likeCount, setLikeCount] = useState(thread.likeCount);
    const [loadingLike, setLoadingLike] = useState(false);

    const toggleLike = async () => {
        if (loadingLike) return;

        const nextLiked = !liked;

        setLiked(nextLiked);
        setLikeCount((c) => c + (nextLiked ? 1 : -1));
        setLoadingLike(true);

        try {
            const res = nextLiked
                ? await likeThreadApi(thread.id)
                : await unlikeThreadApi(thread.id);

            setLiked(res.liked);
            setLikeCount(res.likeCount);
        } catch (e) {
            setLiked(!nextLiked);
            setLikeCount((c) => c + (nextLiked ? -1 : 1));
        } finally {
            setLoadingLike(false);
        }
    };

    useEffect(() => {
        setLiked(thread.likedByMe);
        setLikeCount(thread.likeCount);
    }, [thread.likedByMe, thread.likeCount]);

    const createdAt = new Date(thread.createdAt);

    return (
        <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
            <View style={styles.leftCol}>
                <Pressable
                    onPress={(e) => {
                        e.stopPropagation();
                        onAuthorPress(thread.author.id);
                    }}
                >
                    <Avatar avatarFileName={thread.author.avatarFileName} size={40} borderWidth={1} borderColor="green" />
                </Pressable>
            </View>

            <View style={styles.mainCol}>
                <View style={styles.headerLine}>
                    <Pressable
                        onPress={(e) => {
                            e.stopPropagation();
                            onAuthorPress(thread.author.id);
                        }}
                    >
                        <Text style={styles.username}>{thread.author.username}</Text>
                    </Pressable>
                    <Text style={styles.time}>{formatDateToTimeAgo(createdAt)}</Text>
                </View>

                <Text style={styles.threadTitle}>{thread.title}</Text>
                <Text style={styles.threadBody}>{thread.body}</Text>

                <View style={styles.buttonsRow}>
                    <LikeButton liked={liked} likeCount={likeCount} loading={loadingLike} onPress={toggleLike} />
                    <ReplyButton replyCount={thread.replyCount} />
                </View>
            </View>
        </Pressable>
    );
}