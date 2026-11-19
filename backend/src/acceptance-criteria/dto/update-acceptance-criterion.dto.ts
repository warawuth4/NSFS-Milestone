import { PartialType } from '@nestjs/swagger';
import { CreateAcceptanceCriterionDto } from './create-acceptance-criterion.dto';

export class UpdateAcceptanceCriterionDto extends PartialType(CreateAcceptanceCriterionDto) {}
