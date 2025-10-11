// --- BẠN NÊN TẠO FILE NÀY: styles/AnimeDetailStyles.ts ---
import { StyleSheet } from 'react-native';

// Định nghĩa các hằng số kích thước/padding/margin để dễ quản lý hơn Tailwind
const PADDING_HORIZONTAL = 16;
const POSTER_WIDTH = 110;
const POSTER_HEIGHT = 165;
const ACTION_BUTTON_SIZE = 56; // 14*4 = 56 (w-14 h-14)
const HEADER_ICON_SIZE = 40; // w-10 h-10

export const baseStyles = StyleSheet.create({
    // Global Styles (Không phụ thuộc theme, chỉ là layout/sizing)
    flex1: { flex: 1 },
    px4: { paddingHorizontal: PADDING_HORIZONTAL },
    pb12: { paddingBottom: 48 }, // pb-12
    pt14: { paddingTop: 56 }, // pt-14
    mt20: { marginTop: -80 }, // -mt-20
    mb2: { marginBottom: 8 }, // mb-2
    mb3: { marginBottom: 12 }, // mb-3
    mb6: { marginBottom: 24 }, // mb-6
    ml1: { marginLeft: 4 }, // ml-1
    ml2: { marginLeft: 8 }, // ml-2
    ml4: { marginLeft: 16 }, // ml-4
    gap2: { gap: 8 }, // gap-2
    gap3: { gap: 12 }, // gap-3
    py1: { paddingVertical: 4 }, // py-1
    py3: { paddingVertical: 12 }, // py-3
    py2: { paddingVertical: 8 }, // py-2
    px8: { paddingHorizontal: 32 }, // px-8
    px2_5: { paddingHorizontal: 10 }, // px-2.5
    roundedMd: { borderRadius: 6 }, // rounded-md
    roundedFull: { borderRadius: 9999 }, // rounded-full
    roundedXl: { borderRadius: 12 }, // rounded-xl
    px3: { paddingHorizontal: 12 }, // px-3
    py4: { paddingVertical: 16 }, // py-4
    // Layout
    flexRow: { flexDirection: 'row' },
    itemsCenter: { alignItems: 'center' },
    justifyCenter: { justifyContent: 'center' },
    justifyBetween: { justifyContent: 'space-between' },
    justifyStart: { justifyContent: 'flex-start' },
    itemsStart: { alignItems: 'flex-start' },
    flexWrap: { flexWrap: 'wrap' },
    relative: { position: 'relative' },
    absolute: { position: 'absolute' },
    inset0: { top: 0, bottom: 0, left: 0, right: 0 },
    zIndex20: { zIndex: 20 },
    w1_3: { width: '33.333333%' }, // w-1/3
    textRight: { textAlign: 'right' },
    
    // Kích thước cố định
    h350: { height: 350 }, // h-[350px]
    poster: { width: POSTER_WIDTH, height: POSTER_HEIGHT, borderRadius: 12 },
    
    // Header/Action Buttons
    headerIconBase: { width: HEADER_ICON_SIZE, height: HEADER_ICON_SIZE, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    actionButtonBase: { width: ACTION_BUTTON_SIZE, height: ACTION_BUTTON_SIZE, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
    mainActionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 12 },

    // Text & Fonts
    textBase: { fontSize: 16 },
    textSm: { fontSize: 14 },
    textXs: { fontSize: 12 },
    textXl: { fontSize: 20 },
    text2xl: { fontSize: 24 },
    fontBold: { fontWeight: '700' as 'bold' },
    fontSemibold: { fontWeight: '600' as '600' },
    fontMedium: { fontWeight: '500' as '500' },
    fontExtrabold: { fontWeight: '800' as '800' },
    italic: { fontStyle: 'italic' },
    leadingRelaxed: { lineHeight: 24 }, // leading-relaxed (1.5 * 16px)

    // Colors & Special
    textWhite: { color: '#fff' },
    textRed600: { color: '#dc2626' },
    bgRed600: { backgroundColor: '#dc2626' },
    textYellow500: { color: '#f59e0b' },
    bgBlue600: { backgroundColor: '#2563eb' },
    bgBlack40: { backgroundColor: 'rgba(0, 0, 0, 0.4)' }, // bg-black/40
    
    // Error View
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: PADDING_HORIZONTAL, backgroundColor: '#030712' }, // bg-gray-950
    errorText: { color: '#fff', fontSize: 20, marginBottom: 24, textAlign: 'center' },
    errorButton: { paddingHorizontal: 32, paddingVertical: 12, borderRadius: 12, backgroundColor: '#dc2626' }, // bg-red-600
    errorButtonText: { color: '#fff', fontWeight: '700' as 'bold', fontSize: 16 },
});