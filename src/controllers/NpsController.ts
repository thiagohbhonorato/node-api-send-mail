import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveyUserRepository } from "../repositories/SurveyUserRepository";

class NpsController {

  /**
   * Cálculo NPS
   * 
   * Detratores => 0 - 6
   * Passivos   => 7 - 8
   * Promotores => 9 - 10
   * 
   * (número de promotores - número de detratores) / (número de respondentes) x 100
   */
  async execute(request: Request, response: Response) {
    const { survey_id } = request.params;

    const surveyUserRepository = getCustomRepository(SurveyUserRepository);

    const surveysUsers = await surveyUserRepository.find({
      survey_id,
      value: Not(IsNull())
    });

    const detractor = surveysUsers.filter(survey => survey.value >= 0 && survey.value <= 6).length;
    const passive   = surveysUsers.filter(survey => survey.value >= 7 && survey.value <= 8).length;
    const promotors = surveysUsers.filter(survey => survey.value >= 9 && survey.value <= 10).length;

    const totalAnswers = surveysUsers.length;

    const calculate = Number((((promotors - detractor) / totalAnswers) * 100).toFixed(2));

    return response.json({
      detractor,
      passive,
      promotors,
      totalAnswers,
      nps: calculate
    })
  }
}

export { NpsController }