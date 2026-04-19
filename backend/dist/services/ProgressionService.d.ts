export declare class ProgressionService {
    private progressionRepo;
    private countTotalChapters;
    createProgression(apprenantFormationId: number): Promise<{
        id: number;
        apprenantFormationId: number;
        dateDerniereActivite: Date;
    }>;
    getProgression(apprenantFormationId: number): Promise<any>;
    completeChapter(apprenantFormationId: number, chapitreId: number): Promise<{
        id: number;
        estComplete: boolean;
        dateCompletion: Date | null;
        progressionId: number;
        chapitreId: number;
    }>;
    uncompleteChapter(apprenantFormationId: number, chapitreId: number): Promise<void>;
    getProgressionByProfesseur(professeurId: number): Promise<{
        apprenant: {
            id: any;
            name: string;
        };
        formation: {
            id: any;
            titre: any;
        };
        progression: {
            completedChapters: number;
            totalChapters: number;
            percentage: number;
        };
    }[]>;
}
//# sourceMappingURL=ProgressionService.d.ts.map