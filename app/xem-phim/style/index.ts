import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  videoErrorContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  videoErrorTitle: {
    color: '#f59e0b',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  videoErrorText: {
    color: '#9ca3af',
    fontSize: 14,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  thumbnailContainer: {
    width: 120,
    borderRadius: 12,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: 12,
  },
  infoColumn: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  episodeInfo: {
    fontSize: 12,
    marginTop: 2,
  },
  viewContainer: {
    alignItems: 'center',
    marginLeft: 16,
  },
  viewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 204, 21, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  viewText: {
    color: '#facc15',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 13,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  metaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  metaText: {
    fontSize: 10,
    fontWeight: '500',
  },
  qualityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: '#dc2626',
  },
  qualityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  langBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: '#2563eb',
  },
  langText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#a855f7',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 24,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: 128,
    fontSize: 14,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 32,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  errorText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorSubText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  serverContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  serverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  serverTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  serverList: {
    paddingVertical: 4,
  },
  serverButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  serverButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  descriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  readMoreButton: {
    marginTop: 8,
  },
  readMoreText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '600',
  },
});