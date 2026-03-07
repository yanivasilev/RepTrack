import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ThreadsMainScreen from "../screens/threads/threads-main/ThreadsMainScreen";
import ThreadDetailsScreen from "../screens/threads/thread-details/ThreadDetailsScreen";
import ThreadsSearchScreen from "../screens/threads/threads-search/ThreadsSearchScreen";

export type ThreadsParamList = {
    ThreadsMain: undefined;
    ThreadsSearch: undefined;
    ThreadDetails: {
        threadId: number,
        onThreadUpdated: (payload: {
            threadId: number;
            likedByMe?: boolean;
            likeCount?: number;
            replyCount?: number;
            title?: string;
            body?: string;
        }) => void;
        onThreadDeleted?: (threadId: number) => void;
        onReplyUpdated?: (payload: {
            replyId: number;
            likedByMe?: boolean;
            likeCount?: number;
            body?: string;
            updatedAt?: string;
            deleted?: boolean;
        }) => void;
        source?: "profile" | "userProfile";
        sourceUserId?: number;
        activityMode?: "threads" | "replies";
    };
};

const Stack = createNativeStackNavigator<ThreadsParamList>();

export default function ThreadsNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ThreadsMain" component={ThreadsMainScreen} />
            <Stack.Screen name="ThreadsSearch" component={ThreadsSearchScreen} />
            <Stack.Screen name="ThreadDetails" component={ThreadDetailsScreen} />
        </Stack.Navigator>
    );
}
