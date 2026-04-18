import { Progression, ApprenantChapitre } from "@prisma/client";
export declare class ProgressionRepo {
    private prisma;
    createForApprenantFormation(apprenantFormationId: number): Promise<Progression>;
    findByApprenantFormationId(apprenantFormationId: number): Promise<Progression | null>;
    completeChapter(progressionId: number, chapitreId: number): Promise<ApprenantChapitre>;
    uncompleteChapter(progressionId: number, chapitreId: number): Promise<void>;
    calculateProgression(progressionId: number, totalChapters: number): Promise<number>;
    findApprenantsByProfesseurId(professeurId: number): Promise<any[]>;
}
//# sourceMappingURL=ProgressionRepo.d.ts.map